import type { GameState } from "./model";

export function createInitialGameState(): GameState {
  return {
    screen: "title",
    stageIndex: 0,
    dialogueIndex: 0,
    stats: {
      autonomy: 2,
      discernment: 1,
      connection: 1,
      security: 2,
      meaning: 1,
    },
    publicInfluence: 0,
    flags: [],
    choices: {},
    xiaomanRelation: "unmet",
    qiTendency: "guardian",
    policy: "tech-first",
    pendingChoiceId: null,
    endingId: null,
  };
}

export const initialGameState = createInitialGameState();
