import type { ChapterDefinition, StageId } from "../game/model";
import { adulthoodChapter } from "./chapters/adulthood";
import { childhoodChapter } from "./chapters/childhood";
import { elderChapter } from "./chapters/elder";
import { infantChapter } from "./chapters/infant";
import { midlifeChapter } from "./chapters/midlife";
import { teenChapter } from "./chapters/teen";
import { youthChapter } from "./chapters/youth";

export const chapters: readonly ChapterDefinition[] = Object.freeze([
  infantChapter,
  childhoodChapter,
  teenChapter,
  youthChapter,
  adulthoodChapter,
  midlifeChapter,
  elderChapter,
].sort((left, right) => left.order - right.order));

export function getChapter(stageId: StageId | string): ChapterDefinition {
  const chapter = chapters.find((candidate) => candidate.id === stageId);
  if (chapter) return chapter;

  if (process.env.NODE_ENV === "development") {
    console.warn(`Unknown chapter stage "${stageId}"; falling back to infant.`);
  }

  return infantChapter;
}

export {
  adulthoodChapter,
  childhoodChapter,
  elderChapter,
  infantChapter,
  midlifeChapter,
  teenChapter,
  youthChapter,
};
