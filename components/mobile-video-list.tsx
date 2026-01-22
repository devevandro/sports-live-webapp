"use client";

import { Radio, MoreVertical, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  channel: string;
  viewers: string;
  thumbnail: string;
}

interface MobileVideoListProps {
  videos: Video[];
  selectedVideo: Video;
  onSelectVideo: (video: Video) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function MobileVideoList({
  videos,
  selectedVideo,
  onSelectVideo,
  onRefresh,
  isLoading = false,
}: MobileVideoListProps) {

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f]">
      <div className="sticky top-0 z-10 bg-[#0f0f0f] border-b border-[#272727]">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 rounded-lg">
            <Radio className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-400 font-medium">
              {videos.length + 1} ao vivo
            </span>
          </div>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-white transition-colors rounded",
                "hover:bg-[#272727]/50 disabled:opacity-50 disabled:cursor-not-allowed",
                isLoading && "animate-pulse"
              )}
              title="Atualizar lives"
            >
              <RefreshCw className={cn(
                "w-3 h-3",
                isLoading && "animate-spin"
              )} />
              <span className="text-xs">
                {isLoading ? "Buscando..." : "Atualizar"}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className={cn(
              "w-full text-left transition-colors",
              selectedVideo.id === video.id
                ? "bg-[#272727]"
                : "hover:bg-[#1a1a1a]"
            )}
          >
            <div className="relative w-full aspect-video">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                AO VIVO
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                {video.viewers}
              </div>
            </div>

            <div className="flex gap-3 p-3">
              <div className="w-9 h-9 rounded-full bg-[#272727] shrink-0 flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {video?.channel.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {video.channel}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="shrink-0 p-1 hover:bg-[#3a3a3a] rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
