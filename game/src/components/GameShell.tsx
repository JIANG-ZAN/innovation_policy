"use client";

import type { ChapterDefinition, GameState } from "@/game/model";
import type { SceneAssetDefinition } from "@/content/assets";
import { LifeHud } from "./LifeHud";
import { SafeImage } from "./SafeImage";
import styles from "./GameShell.module.css";
import { type ReactNode, useEffect, useRef } from "react";

interface GameShellProps {
  chapter: ChapterDefinition;
  scene: SceneAssetDefinition;
  sceneKey: string;
  state: GameState;
  onOpenArchive: () => void;
  onReset: () => void;
  children?: ReactNode;
  archiveOpen?: boolean;
}

export function GameShell({
  chapter,
  scene,
  sceneKey,
  state,
  onOpenArchive,
  onReset,
  children,
  archiveOpen = false,
}: GameShellProps) {
  const stageName = chapter.title.split("——")[0];
  const archiveTriggerRef = useRef<HTMLButtonElement>(null);
  const archiveWasOpen = useRef(archiveOpen);
  const storyFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (archiveWasOpen.current && !archiveOpen) {
      archiveTriggerRef.current?.focus();
    }
    archiveWasOpen.current = archiveOpen;
  }, [archiveOpen]);

  useEffect(() => {
    if (storyFrameRef.current) {
      storyFrameRef.current.scrollTop = 0;
    }
  }, [archiveOpen, state.screen, state.stageIndex]);

  return (
    <section className={styles.shell} aria-labelledby="chapter-title">
      <div
        key={sceneKey}
        className={styles.scene}
        style={{ background: scene.fallback }}
        data-testid="scene-layer"
        data-scene={sceneKey}
        data-scene-mode={scene.mode}
      >
        {scene.src ? (
          <SafeImage
            className={styles.sceneImage}
            src={scene.src}
            alt={`${chapter.location}场景`}
            fill
            sizes="100vw"
            preload
          />
        ) : null}
        {scene.mode === "css" ? (
          <span
            className={styles.daySeaLights}
            data-testid="day-sea-lights"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.chapterMeta}>
          <span className={styles.stage}>{stageName}</span>
          <span className={styles.year}>{chapter.year}</span>
          <span className={styles.location}>{chapter.location}</span>
        </div>
        <div className={styles.actions}>
          <button
            ref={archiveTriggerRef}
            className={styles.secondaryAction}
            type="button"
            aria-pressed={state.screen === "archive" || archiveOpen}
            onClick={onOpenArchive}
          >
            人生档案
          </button>
          <button
            className={styles.resetAction}
            type="button"
            onClick={onReset}
          >
            重新开始
          </button>
        </div>
      </header>

      <LifeHud stats={state.stats} />

      <div
        ref={storyFrameRef}
        className={styles.storyFrame}
        data-testid="story-frame"
      >
        <p className={styles.kicker}>第 {chapter.order} 章 · {chapter.age} 岁</p>
        <h1 id="chapter-title">{chapter.title}</h1>
        <p className={styles.question}>{chapter.question}</p>
        {children}
      </div>
    </section>
  );
}
