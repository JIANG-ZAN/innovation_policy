import type { ChapterDefinition } from "../../game/model";
import { characterAssets } from "../assets";
import { choiceDefinitions } from "../choices";

export const childhoodChapter: ChapterDefinition = {
  id: "childhood",
  order: 2,
  year: 2084,
  age: 8,
  title: "幼年期——消失的鸟",
  location: "青屿学习中心及附近旧公园",
  question: "学习是获得答案，还是获得判断答案的能力？",
  scene: "learning-center",
  choiceScenes: { C: "old-park" },
  cast: ["林一", "小满（8岁男孩）", "方老师", "个人AI“栖”"],
  opening: [
    {
      id: "childhood-opening-classroom",
      speaker: "旁白",
      text: "教室没有黑板。方老师关闭每个孩子面前的学习投影，打开一扇真正的窗户。",
      portrait: characterAssets.linyi["08"],
    },
    {
      id: "childhood-opening-question",
      speaker: "方老师",
      text: "今天的问题只有一句——为什么海岚市的鸟越来越少？",
    },
    {
      id: "childhood-opening-method",
      speaker: "方老师",
      text: "模型当然有答案。但我不是问模型知道什么，我是问你们准备怎么知道。",
    },
    {
      id: "childhood-opening-full-chip",
      speaker: "栖",
      text: "完整报告已直接接入意识，预计可获得满分。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["全量芯片"] },
    },
    {
      id: "childhood-opening-guardian-chip",
      speaker: "栖",
      text: "我可以生成完整报告。是否需要先查看证据来源？",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["监护型芯片"] },
    },
    {
      id: "childhood-opening-no-implant",
      speaker: "旁白",
      text: "林一主动打开外部终端。答案出现得比其他同学慢，但终端可以随时关闭。",
      portrait: characterAssets.linyi["08"],
      when: { allFlags: ["无植入"] },
    },
    {
      id: "childhood-opening-fallback",
      speaker: "旁白",
      text: "无论技术入口如何，气候、玻璃建筑、无人机航线和食物链变化都已经列在林一面前。",
    },
    {
      id: "childhood-opening-xiaoman",
      speaker: "小满",
      text: "旧公园里昨天还有一只。我们去找它吧。",
      portrait: characterAssets.xiaoman["08"],
    },
  ],
  choices: [
    choiceDefinitions["childhood-a"],
    choiceDefinitions["childhood-b"],
    choiceDefinitions["childhood-c"],
  ],
  closing: [
    {
      id: "childhood-closing-answer",
      speaker: "方老师",
      text: "如果满分报告里有一处是假的，你知道该从哪里找吗？",
      when: { allFlags: ["答案依赖"] },
    },
    {
      id: "childhood-closing-evidence",
      speaker: "方老师",
      text: "你没有回答为什么。承认现有数据不足，也是一种答案。",
      when: { allFlags: ["查证习惯"] },
    },
    {
      id: "childhood-closing-park",
      speaker: "小满",
      text: "听见了吗？这次不是模拟音效。",
      portrait: characterAssets.xiaoman["08"],
      when: { allFlags: ["小满羁绊", "线下协作"] },
    },
    {
      id: "childhood-closing-fallback",
      speaker: "旁白",
      text: "夜晚，林一躺在床上。窗外，一只真实的鸟落在自动充电桩上。",
      portrait: characterAssets.linyi["08"],
    },
    {
      id: "childhood-closing-memory",
      speaker: "栖",
      text: "我可以删除无关噪声，只保留学习成果。",
      portrait: characterAssets.qi.silent,
    },
    {
      id: "childhood-closing-noise",
      speaker: "林一",
      text: "哪一部分算噪声？",
      portrait: characterAssets.linyi["08"],
    },
    {
      id: "childhood-closing-definition",
      speaker: "栖",
      text: "这需要由你定义。",
      portrait: characterAssets.qi.assist,
    },
  ],
};
