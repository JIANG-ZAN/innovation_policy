"use client";

import { useEffect, useRef } from "react";

/**
 * 全局背景音乐无缝循环播放器（无任何可见播放标志）。
 * - 进入页面不自动播放，保持安静；
 * - 用户首次点击/触摸页面任意位置时，带声开始播放（音量 0.8）。
 * - 采用多事件 + 静音兜底策略，兼容 iOS / 各类 WebView 的自动播放限制：
 *   优先尝试带声播放；若被浏览器策略拦截，则先静音起步建立“已激活”状态，再恢复出声。
 * - final2.mp3（约 3MB，2 分 18 秒）无缝循环。
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.8;
    // 进入页面即开始缓冲，减少点击后的等待
    audio.load();

    let unlocked = false;

    const release = () => {
      window.removeEventListener("pointerdown", onUnlock, true);
      window.removeEventListener("pointerup", onUnlock, true);
      window.removeEventListener("touchstart", onUnlock, true);
      window.removeEventListener("touchend", onUnlock, true);
      window.removeEventListener("click", onUnlock, true);
    };

    const onUnlock = () => {
      if (unlocked) return;
      unlocked = true;
      release();
      const tryAudible = () => {
        if (audio.paused) {
          audio.muted = false;
          audio.volume = 0.8;
          audio.play().catch(() => {
            // 带声播放被拦（常见于 iOS/WebView）：静音起步建立激活，随后恢复
            audio.muted = true;
            audio
              .play()
              .then(() => {
                audio.muted = false;
                audio.volume = 0.8;
              })
              .catch(() => {});
          });
        }
      };
      tryAudible();
    };

    // 捕获阶段监听：在事件到达目标元素前先建立播放手势，对 Chromium 内核更可靠
    window.addEventListener("pointerdown", onUnlock, true);
    window.addEventListener("touchstart", onUnlock, true);
    window.addEventListener("touchend", onUnlock, true);
    window.addEventListener("pointerup", onUnlock, true);
    window.addEventListener("click", onUnlock, true);

    return () => {
      release();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/audio/final2.mp3"
      preload="auto"
      loop
    />
  );
}
