"use client";

import { useState } from "react";
import { Bug, ChevronDown, ChevronUp } from "lucide-react";

interface DebugPanelProps {
  videos: any[];
  selectedVideo: any;
  error?: string;
}

export function DebugPanel({ videos, selectedVideo, error }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg px-3 py-2 text-xs hover:bg-red-600/30 transition-colors"
      >
        <Bug className="w-4 h-4" />
        Debug
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-[#0f0f0f] border border-[#272727] rounded-lg p-4 w-80 max-h-96 overflow-y-auto text-xs">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-1">Vídeos carregados:</h4>
              <p className="text-green-400">{videos.length} vídeos</p>
            </div>

            {error && (
              <div>
                <h4 className="font-semibold text-red-400 mb-1">Erro:</h4>
                <p className="text-red-300 overflow-wrap-break-word">{error}</p>
              </div>
            )}

            {selectedVideo && (
              <div>
                <h4 className="font-semibold text-white mb-1">Vídeo selecionado:</h4>
                <div className="text-gray-300 space-y-1">
                  <p><span className="text-blue-400">ID:</span> {selectedVideo.id}</p>
                  <p><span className="text-blue-400">Título:</span> {selectedVideo.title}</p>
                  <p><span className="text-blue-400">Canal:</span> {selectedVideo.channel}</p>
                  <p><span className="text-blue-400">URL:</span> https://youtube.com/watch?v={selectedVideo.id}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-white mb-1">Lista de vídeos:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {videos.map((video, index) => (
                  <div key={`debug-${video.id}-${index}`} className="text-gray-400 text-[10px] border-l-2 border-gray-600 pl-2">
                    <p className="text-white">{index + 1}. {video.title}</p>
                    <p>ID: {video.id}</p>
                    <p>Canal: {video.channel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
