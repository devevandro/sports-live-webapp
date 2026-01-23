import { NextResponse } from "next/server";

let cachedVideos: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 8 * 60 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const now = Date.now();
    const cacheExpired = now - lastFetchTime > CACHE_DURATION;

    if (!forceRefresh && cachedVideos.length > 0 && !cacheExpired) {
      console.log("Retornando dados do cache");
      return NextResponse.json({
        videos: cachedVideos,
        fromCache: true,
        lastUpdate: new Date(lastFetchTime).toISOString(),
        nextUpdate: new Date(lastFetchTime + CACHE_DURATION).toISOString(),
      });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API key não configurada" },
        { status: 500 },
      );
    }

    const channelIds = [
      "UCs-6sCz2LJm1PrWQN4ErsPw",
      "UC6dZOvuuxPz5Mw8FmbLPZYQ",
      "UCU7CKWffsyRnkG2yfI8w3gA",
      "UCMcc9elPZGpg6eU4i3YaCpA",
      "UCZaOZdn-Y-I5ikrofkWBLgQ",
      "UCWJ2lWNubArHWmf3FIHbfcQ",
      "UCw5-xj3AKqEizC7MvHaIPqA",
      "UCH-BU-Os3JSo2L8lBQxE8KA",
      "UCH4Cn6LPGlC9oBqrfh1qySg",
      "UC9mdw2mmn49ZuqGOpSri7Fw",
      "UCf9WJPpsh5BHDY-OeISgIq",
      "UCb74ViTMFgndOaTehM5PVdg",
      "UCzRogd_oK3bzKvAW-4aLuPQ",
      "UCTRp0APA50MmSh9U03MDXSA",
      "UCgCKagVhzGnZcuP9bSMgMCg",
      "UCFjrDmEnxrG5TRGVO0TPHLA",
      "UCZiYbVptd3PVPf4f6eR6UaQ",
      "UC94kyY3rSw4j4LjAd8tUBBw",
      "UCk_kqhVTW4TTS3wB15lrdBw",
      "UCrlSTiILK9Q61R11O_gEuNg",
      "UCuGW2-KtjIS2GI707tO8H9A",
    ];

    const videosMap = new Map();

    async function fetchLiveVideos(channelId: string) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${API_KEY}&maxResults=20`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dados recebidos da API do YouTube:", data);

        if (data.items && data.items.length > 0) {
          const videoIds = data.items.map((item: any) => item.id.videoId);

          data.items.forEach((videoDetail: any) => {
            videosMap.set(videoDetail.id, {
              id: videoDetail.id,
              title: videoDetail.snippet.title,
              channel: videoDetail.snippet.channelTitle,
              thumbnail: videoDetail.snippet.thumbnails?.default?.url,
              viewers: "Ao vivo",
              categoryId: videoDetail.snippet.categoryId,
            });
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.error(`Timeout ao processar canal ${channelId}`);
          } else if (error.message.includes("HTTP")) {
            console.error(
              `Erro HTTP ao processar canal ${channelId}:`,
              error.message,
            );
          } else {
            console.error(
              `Erro ao processar canal ${channelId}:`,
              error.message,
            );
          }
        } else {
          console.error(
            `Erro desconhecido ao processar canal ${channelId}:`,
            error,
          );
        }
      }
    }

    const batchSize = 1;
    const batches = [];

    for (let i = 0; i < channelIds.length; i += batchSize) {
      batches.push(channelIds.slice(i, i + batchSize));
    }

    console.log(
      `Processando ${batches.length} lotes com ${batchSize} canal(is) cada`,
    );

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      console.log(`Processando lote ${i + 1}/${batches.length}...`);

      for (const channelId of batch) {
        await fetchLiveVideos(channelId);

        if (batch.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (i < batches.length - 1) {
        const delayTime = 1500;
        console.log(`Aguardando ${delayTime}ms antes do próximo lote...`);
        await new Promise((resolve) => setTimeout(resolve, delayTime));
      }
    }

    const videos = [...videosMap.values()];

    cachedVideos = videos;
    lastFetchTime = now;

    console.log(`Total de vídeos encontrados: ${videos.length}`);
    console.log(`Canais processados: ${channelIds.length}`);
    console.log(`Vídeos de futebol filtrados: ${videos.length}`);
    console.log("Cache atualizado");

    if (videos.length === 0) {
      console.warn(
        "Nenhum vídeo de futebol ao vivo encontrado. Possíveis causas:",
      );
      console.warn("1. Rate limiting da API do YouTube");
      console.warn("2. Nenhum canal está transmitindo futebol ao vivo");
      console.warn("3. Problema com a chave da API");
      console.warn("4. Vídeos ao vivo não são da categoria futebol (17)");
    }

    return NextResponse.json({
      videos,
      fromCache: false,
      lastUpdate: new Date(lastFetchTime).toISOString(),
      nextUpdate: new Date(lastFetchTime + CACHE_DURATION).toISOString(),
    });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);

    if (cachedVideos.length > 0) {
      console.log("Retornando dados do cache devido ao erro");
      return NextResponse.json({
        videos: cachedVideos,
        fromCache: true,
        error: "Dados do cache devido a erro na API",
        lastUpdate: new Date(lastFetchTime).toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 },
    );
  }
}
