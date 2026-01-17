"use client";

import { useState } from "react";
import { ChevronUp, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  channel: string;
  viewers: string;
  thumbnail: string;
}

interface VideoSidebarProps {
  videos: Video[];
  selectedVideo: Video;
  onSelectVideo: (video: Video) => void;
}

export function VideoSidebar({
  videos,
  selectedVideo,
  onSelectVideo,
}: VideoSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isExpanded ? "h-52" : "h-6"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-red-600/20 to-transparent flex items-center justify-center transition-opacity duration-300",
          isExpanded ? "opacity-0" : "opacity-100"
        )}
      >
        <ChevronUp className="w-5 h-5 text-red-500 animate-bounce" />
      </div>

      <div
        className={cn(
          "h-full bg-[#181818] border-t border-[#272727] overflow-hidden transition-all duration-300",
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        )}
      >
        <div className="p-3 border-b border-[#272727] flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-500" />
          <h2 className="font-semibold text-white text-sm">Lives</h2>
          <span className="text-xs text-muted-foreground">
            ({videos.length} ao vivo)
          </span>
        </div>

        <div className="overflow-x-auto overflow-y-hidden h-[calc(100%-44px)] px-3 py-2">
          <div className="flex gap-3 h-full">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className={cn(
                  "shrink-0 w-48 p-2 rounded-lg transition-all duration-200 text-left group cursor-pointer",
                  selectedVideo.id === video.id
                    ? "bg-[#272727] ring-1 ring-red-500/50"
                    : "hover:bg-[#272727]/50"
                )}
              >
                <div className="flex gap-3 h-full">
                  <div className="relative w-24 shrink-0 rounded-md overflow-hidden">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-red-600 text-white text-[8px] font-semibold px-1 py-0.5 rounded flex items-center gap-0.5">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="text-xs font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      {video.channel}
                    </p>
                    <p className="text-[10px] text-red-400 mt-0.5">
                      {video.viewers}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
