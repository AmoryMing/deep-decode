"use client";

import { useState } from "react";

export function PostMedia({
  podcast,
  videoH,
  videoV,
}: {
  podcast?: string;
  videoH?: string;
  videoV?: string;
}) {
  const hasVideo = Boolean(videoH || videoV);
  const [mode, setMode] = useState<"h" | "v">(videoH ? "h" : "v");
  if (!podcast && !hasVideo) return null;

  const videoSrc = mode === "h" ? videoH ?? videoV : videoV ?? videoH;

  return (
    <div className="my-7 flex flex-col gap-5 rounded-xl border border-line bg-white p-4">
      {podcast && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            播客版
          </div>
          <audio
            controls
            preload="none"
            src={podcast}
            className="w-full"
          />
        </div>
      )}
      {hasVideo && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-ink" />
              视频版
            </div>
            {videoH && videoV && (
              <div className="flex gap-1">
                <ModeBtn active={mode === "h"} onClick={() => setMode("h")}>
                  横版
                </ModeBtn>
                <ModeBtn active={mode === "v"} onClick={() => setMode("v")}>
                  竖版
                </ModeBtn>
              </div>
            )}
          </div>
          <video
            key={videoSrc}
            controls
            preload="metadata"
            src={videoSrc}
            className={`w-full rounded-lg bg-black ${
              mode === "v" ? "mx-auto max-w-xs" : ""
            }`}
          />
        </div>
      )}
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2.5 py-1 text-xs transition-colors ${
        active ? "bg-ink text-paper" : "bg-line/60 text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}
