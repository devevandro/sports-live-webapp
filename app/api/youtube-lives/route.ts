import { NextResponse } from "next/server";

export async function GET() {
  try {
    const channels = [
      "@canalgoatbr",
      "@EsportenaBand",
      "@espnbrasil",
      "@xsports.brasil",
      "@paulistao",
      "@MetropolesEsportes",
      "@NSports",
      "@federacaopr",
      "@aleagues",
      "@tvbrasilcentral",
      "@SportyNetBrasil",
      "@getv",
      "desimpedidos",
    ];

    const videosMap = new Map();

    async function processUrl(channel: string) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        console.log(`Buscando dados de: ${channel}`);
        const response = await fetch(`https://www.youtube.com/${channel}`, {
          headers: { "User-Agent": "Mozilla/5.0" },
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

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

    await Promise.all(channels.map(processUrl));

    const videos = [...videosMap.values()];

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 }
    );
  }
}
