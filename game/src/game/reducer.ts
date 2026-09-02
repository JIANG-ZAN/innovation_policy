import { createInitialGameState } from "./initial-state";
import { choiceDefinitions } from "../content/choices";
import {
  applyChoice,
  derivePolicy,
  deriveQiTendency,
  deriveXiaomanRelation,
  resolveConditionalFlags,
} from "./rules";
import { deriveEnding } from "./selectors";
import type { GameAction, GameState, StageId } from "./model";

const stageIds: StageId[] = [
  "infant",
  "childhood",
  "teen",
  "youth",
  "adulthood",
  "midlife",
  "elder",
];

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return { ...state, screen: "story" };
    case "ADVANCE_DIALOGUE":
      return {
        ...state,
        dialogueIndex: Math.min(
          state.dialogueIndex + 1,
          Math.max(action.lineCount - 1, 0),
        ),
      };
    case "OPEN_CHOICES":
      return { ...state, screen: "choice" };
    case "SHOW_OUTCOME":
      return { ...state, screen: "outcome" };
    case "OPEN_ARCHIVE":
      return { ...state, screen: "archive" };
    case "RESET_GAME":
      return createInitialGameState();
    case "SUBMIT_CHOICE": {
      const choice = choiceDefinitions[action.choiceId];
      const currentStage = stageIds[state.stageIndex];

      if (state.screen !== "choice" || !choice || !currentStage || !choice.id.startsWith(`${currentStage}-`)) {
        return state;
      }

      const next = applyChoice(state, choice);
      if (next === state) {
        return state;
      }

      const resolved = resolveConditionalFlags(next);
      return {
        ...resolved,
        screen: "outcome",
        xiaomanRelation: deriveXiaomanRelation(resolved.flags),
        qiTendency: deriveQiTendency(resolved),
        policy: derivePolicy(resolved),
      };
    }
    case "ADVANCE_STAGE":
      if (
        state.screen !== "archive" ||
        !stageIds[state.stageIndex] ||
        !state.choices[stageIds[state.stageIndex]]
      ) {
        return state;
      }
      if (state.stageIndex === stageIds.length - 1) {
        return {
          ...state,
          screen: "ending",
          endingId: deriveEnding(state),
        };
      }
      return {
        ...state,
        screen: "story",
        stageIndex: state.stageIndex + 1,
        dialogueIndex: 0,
        pendingChoiceId: null,
      };
  }
}
