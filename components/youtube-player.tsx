"use client";

import { useState, useRef, useEffect } from "react";
import { VideoSidebar } from "./video-sidebar";
import { MobileVideoList } from "./mobile-video-list";
import { Loader2, VideoOff } from "lucide-react";

interface Video {
  id: string;
  title: string;
  channel: string;
  viewers: string;
  thumbnail: string;
}

export function YouTubePlayer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noLives, setNoLives] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function fetchVideos(forceRefresh = false) {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const url = forceRefresh ? "/api/youtube-lives?refresh=true" : "/api/youtube-lives";
      const response = await fetch(url);
      const data = await response.json();
      
      const videoList = data.videos || data;
      
      if (Array.isArray(videoList) && videoList.length > 0) {
        setVideos(videoList);
        if (!selectedVideo || !videoList.find(v => v.id === selectedVideo.id)) {
          setSelectedVideo(videoList[0]);
        }
        setNoLives(false);
      } else {
        setVideos([]);
        setSelectedVideo(null);
        setNoLives(true);
      }
      
      if (forceRefresh && data.fromCache === false) {
        console.log('Lives atualizadas da API');
      } else if (data.fromCache) {
        console.log('Lives carregadas do cache');
      }
      
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      setVideos([]);
      setSelectedVideo(null);
      setNoLives(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0f0f0f] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
          <p className="text-muted-foreground">Carregando lives...</p>
        </div>
      </div>
    );
  }

  if (noLives || !selectedVideo) {
    return (
      <div className="flex min-h-screen bg-[#0f0f0f] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-24 h-24 rounded-full bg-[#272727] flex items-center justify-center">
            <VideoOff className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Sem evento no momento
          </h1>
          <p className="text-muted-foreground max-w-md">
            Não há transmissões ao vivo disponíveis no momento. Volte mais tarde
            para conferir novos eventos.
          </p>
        </div>
      </div>
    );
  }

  const otherVideos = videos.filter((v) => v.id !== selectedVideo.id);

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-[#0f0f0f]">
      <div className="hidden md:block">
        <VideoSidebar
          videos={videos}
          selectedVideo={selectedVideo}
          onSelectVideo={setSelectedVideo}
          onRefresh={() => fetchVideos(true)}
          isLoading={isRefreshing}
        />
      </div>

      <div className="md:hidden flex flex-col h-screen">
        <div className="w-full shrink-0 sticky top-0 z-10 bg-[#0f0f0f]">
          <div className="relative w-full aspect-video bg-black">
            <iframe
              key={selectedVideo.id}
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&mute=0&playsinline=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="px-3 py-2 border-b border-[#272727]">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                AO VIVO
              </span>
              <span className="text-muted-foreground text-xs">
                {selectedVideo.viewers}
              </span>
            </div>
            <h1 className="text-sm font-medium text-white line-clamp-2">
              {selectedVideo.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedVideo.channel}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <MobileVideoList
            videos={otherVideos}
            selectedVideo={selectedVideo}
            onSelectVideo={setSelectedVideo}
            onRefresh={() => fetchVideos(true)}
            isLoading={isRefreshing}
          />
        </div>
      </div>

      <div className="hidden md:flex h-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl group">
            <iframe
              key={selectedVideo.id}
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&mute=0`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div className="mt-4 text-foreground">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                AO VIVO
              </span>
              <span className="text-muted-foreground text-sm">
                {selectedVideo.viewers}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              {selectedVideo.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedVideo.channel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
