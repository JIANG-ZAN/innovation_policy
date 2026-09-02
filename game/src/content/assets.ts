export interface SceneAssetDefinition {
  src: string | null;
  fallback: string;
  mode: "image" | "css";
}

export const sceneAssets = {
  birth: {
    src: "/assets/scenes/01-birth.png",
    fallback: "linear-gradient(145deg, #071526 0%, #164b71 55%, #8ed7e8 100%)",
    mode: "image",
  },
  "learning-center": {
    src: "/assets/scenes/02-learning.png",
    fallback: "linear-gradient(145deg, #091d2d 0%, #245974 52%, #91c4ba 100%)",
    mode: "image",
  },
  "old-park": {
    src: "/assets/scenes/03-park.png",
    fallback: "linear-gradient(145deg, #0f251f 0%, #376b52 55%, #c2bd72 100%)",
    mode: "image",
  },
  "risk-room": {
    src: "/assets/scenes/04-risk.png",
    fallback: "linear-gradient(145deg, #160f24 0%, #49365f 55%, #bb6d6d 100%)",
    mode: "image",
  },
  "life-planning": {
    src: "/assets/scenes/05-planning.png",
    fallback: "linear-gradient(145deg, #111b31 0%, #395a89 55%, #e0b471 100%)",
    mode: "image",
  },
  "work-service": {
    src: "/assets/scenes/06-services.png",
    fallback: "linear-gradient(145deg, #111c28 0%, #3e6070 55%, #b9d0c5 100%)",
    mode: "image",
  },
  "medical-room": {
    src: "/assets/scenes/07-medical.png",
    fallback: "linear-gradient(145deg, #101827 0%, #3d536c 55%, #b9cbd8 100%)",
    mode: "image",
  },
  "longevity-room": {
    src: "/assets/scenes/08-longevity.png",
    fallback: "linear-gradient(145deg, #090e18 0%, #343f58 55%, #9c91b7 100%)",
    mode: "image",
  },
  "day-sea": {
    src: null,
    fallback: "radial-gradient(circle at 50% 25%, #b9f4ff 0%, #3198c7 32%, #12385f 70%, #071426 100%)",
    mode: "css",
  },
} as const satisfies Record<string, SceneAssetDefinition>;

export const characterAssets = {
  linyi: {
    "00": "/assets/characters/linyi/00-infant.png",
    "08": "/assets/characters/linyi/08-child.png",
    "16": "/assets/characters/linyi/16-teen.png",
    "23": "/assets/characters/linyi/23-young-adult.png",
    "38": "/assets/characters/linyi/38-adult.png",
    "58": "/assets/characters/linyi/58-middle-age.png",
    "98": "/assets/characters/linyi/98-elder.png",
  },
  zhoulan: {
    "35": "/assets/characters/zhoulan/35-infant.png",
    "58": "/assets/characters/zhoulan/58-young-adult.png",
    "93": "/assets/characters/zhoulan/93-middle-age.png",
  },
  xiaoman: {
    "08": "/assets/characters/xiaoman/male/08-child.png",
    "16": "/assets/characters/xiaoman/male/16-teen.png",
    "23": "/assets/characters/xiaoman/male/23-young-adult.png",
    "38": "/assets/characters/xiaoman/male/38-adult.png",
    "58": "/assets/characters/xiaoman/male/58-middle-age.png",
  },
  qi: {
    silent: "/assets/characters/qi/silent.png",
    assist: "/assets/characters/qi/assist.png",
    warning: "/assets/characters/qi/warning.png",
  },
} as const;
