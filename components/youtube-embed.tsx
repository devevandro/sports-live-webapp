"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
}

export function YouTubeEmbed({ 
  videoId, 
  title, 
  className = "", 
  autoplay = true, 
  muted = false 
}: YouTubeEmbedProps) {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  useEffect(() => {
    setHasError(false);
    setRetryCount(0);
  }, [videoId]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?` + 
    new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      enablejsapi: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      controls: '1',
      iv_load_policy: '3',
      fs: '1',
      hl: 'pt',
      cc_lang_pref: 'pt',
      start: '0',
      widget_referrer: typeof window !== 'undefined' ? window.location.origin : '',
    }).toString();

  const handleIframeError = () => {
    console.error(`Erro ao carregar vídeo ${videoId}`);
    setHasError(true);
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setHasError(false);
      setRetryCount(prev => prev + 1);
    }
  };

  const openInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (hasError) {
    return (
      <div className={`bg-[#1a1a1a] border border-[#333] rounded-lg flex flex-col items-center justify-center p-6 ${className}`}>
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">Erro no player</h3>
        <p className="text-gray-400 text-sm text-center mb-4 max-w-md">
          Não foi possível carregar o vídeo. Isso pode acontecer devido a restrições do canal ou problemas de conectividade.
        </p>
        <div className="flex gap-3">
          {retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Tentar novamente ({retryCount + 1}/{maxRetries + 1})
            </button>
          )}
          <button
            onClick={openInYouTube}
            className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors text-sm flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir no YouTube
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <iframe
        key={`${videoId}-${retryCount}`}
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        onError={handleIframeError}
        onLoad={() => {
          console.log(`Vídeo ${videoId} carregado com sucesso`);
          setHasError(false);
        }}
        style={{
          border: 'none',
          outline: 'none'
        }}
      />
    </div>
  );
}
