"use client";

import { useReducer, useState } from "react";
import { sceneAssets } from "@/content/assets";
import { chapters, getChapter } from "@/content";
import { initialGameState } from "@/game/initial-state";
import { gameReducer } from "@/game/reducer";
import { GameShell } from "./GameShell";
import { TitleScreen } from "./TitleScreen";
import { StoryScene } from "./StoryScene";
import { ChoicePanel } from "./ChoicePanel";
import { OutcomePanel } from "./OutcomePanel";
import { LifeArchive } from "./LifeArchive";
import { StageTransition } from "./StageTransition";
import { EndingScreen } from "./EndingScreen";
import { choiceDefinitions } from "@/content/choices";
import styles from "./GameApp.module.css";

export function GameApp() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [archivePreview, setArchivePreview] = useState(false);
  const chapter = chapters[state.stageIndex] ?? getChapter("infant");
  const selectedChoice = state.pendingChoiceId ? choiceDefinitions[state.pendingChoiceId] : null;
  const selectedScene = selectedChoice ? chapter.choiceScenes?.[selectedChoice.key] : undefined;
  const sceneKey = selectedScene ?? chapter.scene;
  const scene = sceneAssets[sceneKey as keyof typeof sceneAssets];

  const content = (() => {
    switch (state.screen) {
      case "story":
        return <><StageTransition chapter={chapter} /><StoryScene chapter={chapter} state={state} onAdvance={(lineCount) => dispatch({ type: "ADVANCE_DIALOGUE", lineCount })} onComplete={() => dispatch({ type: "OPEN_CHOICES" })} /></>;
      case "choice":
        return <ChoicePanel choices={chapter.choices} selectedId={state.pendingChoiceId} onChoose={(choiceId) => dispatch({ type: "SUBMIT_CHOICE", choiceId })} />;
      case "outcome":
        return selectedChoice ? <OutcomePanel key={selectedChoice.id} chapter={chapter} choice={selectedChoice} state={state} onArchive={() => dispatch({ type: "OPEN_ARCHIVE" })} /> : null;
      case "archive":
        return <LifeArchive mode="committed" chapter={chapter} state={state} onAdvance={() => dispatch({ type: "ADVANCE_STAGE" })} />;
      case "ending":
        return (
          <EndingScreen
            state={state}
            onRestart={() => {
              setArchivePreview(false);
              dispatch({ type: "RESET_GAME" });
            }}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <main className={styles.app}>
      {state.screen === "title" ? (
        <TitleScreen onStart={() => dispatch({ type: "START_GAME" })} />
      ) : (
        <GameShell
          chapter={chapter}
          scene={scene ?? sceneAssets.birth}
          sceneKey={sceneKey}
          state={state}
          archiveOpen={archivePreview}
          onOpenArchive={() => {
            if (state.screen !== "archive") {
              setArchivePreview((open) => !open);
            }
          }}
          onReset={() => {
            setArchivePreview(false);
            dispatch({ type: "RESET_GAME" });
          }}
        >
          <div hidden={archivePreview} aria-hidden={archivePreview || undefined}>
            {content}
          </div>
          {archivePreview ? (
            <LifeArchive
              mode="preview"
              chapter={chapter}
              state={state}
              onClose={() => setArchivePreview(false)}
            />
          ) : null}
        </GameShell>
      )}
    </main>
  );
}
