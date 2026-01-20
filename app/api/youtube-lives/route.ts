import { NextResponse } from "next/server";

export async function GET() {
  try {
    const channels = [
      "@canalgoatbr",
      "@SportyNetBrasil",
      "@EsportenaBand",
      "@nbabrasil",
      "@espnbrasil",
      "@xsports.brasil",
      "@paulistao",
      "@MetropolesEsportes",
      "@NSports",
      "@federacaopr",
      "@aleagues",
      "@tvbrasilcentral",
      "@getv",
      "@desimpedidos",
      "@CazeTV",
      "@tveespiritosanto",
      "@rcsportoficial",
      "@TVFNF"
    ];

    const videosMap = new Map();

    async function processUrl(channel: string) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000); // Reduzido para 6s

        const response = await fetch(`https://www.youtube.com/${channel}`, {
          headers: { 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        
        if (html.length < 1000) {
          console.warn(`HTML muito pequeno para ${channel}: ${html.length} caracteres`);
          console.warn(`Primeiros 500 caracteres:`, html.substring(0, 500));
        }

        const match = html.match(/var ytInitialData = ({.*?});/);

        if (!match) {
          console.warn(`ytInitialData não encontrado para URL: ${channel}`);
          return;
        }

        let ytInitialData;
        try {
          const jsonStr = match[1].replace(/\n/g, "").replace(/\r/g, "");
          ytInitialData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error(
            `Erro ao fazer parse do JSON para URL ${channel}:`,
            parseError
          );
          return;
        }

        function walk(obj: any) {
          if (!obj || typeof obj !== "object") return;

          if (obj.videoRenderer) {
            const vr = obj.videoRenderer;

            const isWatching = vr.viewCountText?.runs?.some(
              (run: any) => run?.text === " assistindo"
            );

            if (isWatching && vr.videoId) {
              const thumbnails = vr.thumbnail?.thumbnails ?? [];

              const title =
                vr.title?.runs?.map((r: any) => r.text).join("") ?? null;

              const channel =
                vr.ownerText?.runs?.map((r: any) => r.text).join("") ??
                vr.shortBylineText?.runs?.map((r: any) => r.text).join("") ??
                null;

              const viewersText =
                vr.viewCountText?.runs?.map((r: any) => r.text).join("") ??
                "Ao vivo";

              videosMap.set(vr.videoId, {
                id: vr.videoId,
                title,
                channel,
                thumbnail: thumbnails[2]?.url ?? thumbnails[1]?.url ?? null,
                viewers: viewersText,
              });
            }
          }

          for (const key in obj) {
            walk(obj[key]);
          }
        }

        walk(ytInitialData);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.error(`Timeout ao processar URL ${channel}`);
          } else if (error.message.includes("HTTP")) {
            console.error(`Erro HTTP ao processar URL ${channel}:`, error.message);
          } else {
            console.error(`Erro ao processar URL ${channel}:`, error.message);
          }
        } else {
          console.error(`Erro desconhecido ao processar URL ${channel}:`, error);
        }
      }
    }

    const batchSize = 3;
    const batches = [];
    
    for (let i = 0; i < channels.length; i += batchSize) {
      batches.push(channels.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await Promise.all(batch.map(processUrl));
      if (batch !== batches[batches.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const videos = [...videosMap.values()];
    
    console.log(`Total de vídeos encontrados: ${videos.length}`);
    console.log(`Canais processados: ${channels.length}`);
    
    if (videos.length === 0) {
      console.warn('Nenhum vídeo ao vivo encontrado. Possíveis causas:');
      console.warn('1. Rate limiting do YouTube');
      console.warn('2. Mudança na estrutura HTML');
      console.warn('3. Bloqueio de IP/User-Agent');
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 }
    );
  }
}
