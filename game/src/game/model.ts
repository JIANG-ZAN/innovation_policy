export type StageId =
  | "infant"
  | "childhood"
  | "teen"
  | "youth"
  | "adulthood"
  | "midlife"
  | "elder";

export type ChoiceKey = "A" | "B" | "C";
export type ChoiceId = `${StageId}-${Lowercase<ChoiceKey>}`;
export type StatKey =
  | "autonomy"
  | "discernment"
  | "connection"
  | "security"
  | "meaning";
export type Screen = "title" | "story" | "choice" | "outcome" | "archive" | "ending";
export type XiaomanRelation =
  | "unmet"
  | "acquaintance"
  | "bond"
  | "strong-bond"
  | "estranged"
  | "lost";
export type QiTendency = "guardian" | "symbiotic" | "tool";
export type PolicyEnvironment =
  | "tech-first"
  | "co-governance"
  | "human-limits"
  | "social-conflict";
export type EndingId =
  | "endless-node"
  | "data-ghost"
  | "rule-shaper"
  | "bounded-symbiosis"
  | "human-warmth"
  | "trace-free-exit";

export interface Stats {
  autonomy: number;
  discernment: number;
  connection: number;
  security: number;
  meaning: number;
}

export interface ChoiceDefinition {
  id: ChoiceId;
  key: ChoiceKey;
  title: string;
  action: string;
  risk: string;
  deltas: Partial<Record<StatKey | "publicInfluence", number>>;
  addFlags: string[];
  immediateOutcome: string[];
  delayedEcho: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  portrait?: string;
  when?: {
    allFlags?: string[];
    anyFlags?: string[];
    noneFlags?: string[];
    qiTendency?: QiTendency | QiTendency[];
  };
}

export interface ChapterDefinition {
  id: StageId;
  order: number;
  year: number;
  age: number;
  title: string;
  location: string;
  question: string;
  scene: string;
  choiceScenes?: Partial<Record<ChoiceKey, string>>;
  cast: string[];
  opening: DialogueLine[];
  choices: [ChoiceDefinition, ChoiceDefinition, ChoiceDefinition];
  closing: DialogueLine[];
}

export interface GameState {
  screen: Screen;
  stageIndex: number;
  dialogueIndex: number;
  stats: Stats;
  publicInfluence: number;
  flags: string[];
  choices: Partial<Record<StageId, ChoiceId>>;
  xiaomanRelation: XiaomanRelation;
  qiTendency: QiTendency;
  policy: PolicyEnvironment;
  pendingChoiceId: ChoiceId | null;
  endingId: EndingId | null;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "ADVANCE_DIALOGUE"; lineCount: number }
  | { type: "OPEN_CHOICES" }
  | { type: "SUBMIT_CHOICE"; choiceId: ChoiceId }
  | { type: "SHOW_OUTCOME" }
  | { type: "OPEN_ARCHIVE" }
  | { type: "ADVANCE_STAGE" }
  | { type: "RESET_GAME" };
