"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 全局背景音乐循环播放器。
 * - 挂载后自动尝试播放（浏览器可能拦截无声自动播放，被拦截时等待用户点击按钮）
 * - 点击圆形按钮可在 播放 / 暂停 之间切换
 * - 音轨为 11 分 30 秒的无缝循环曲，自然首尾相接
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.8;
    // 尝试自动播放；若被浏览器策略拦截则等待用户手动触发
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <audio
        ref={audioRef}
        src="/audio/loop10min_seamless.mp3"
        preload="auto"
        loop
      />
      <button
        onClick={toggle}
        aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
        title={playing ? "暂停背景音乐" : "播放背景音乐"}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontSize: 18,
          lineHeight: 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {playing ? "⏸" : "▶"}
      </button>
    </div>
  );
}
