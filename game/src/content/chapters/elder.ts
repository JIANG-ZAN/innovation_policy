import type { ChapterDefinition } from "../../game/model";
import { characterAssets } from "../assets";
import { choiceDefinitions } from "../choices";

export const elderChapter: ChapterDefinition = {
  id: "elder",
  order: 7,
  year: 2174,
  age: 98,
  title: "老年期——余生协议",
  location: "安澜医院长寿医学中心，单人病房与门外走廊",
  question: "你作出的这些选择，是否构成了“你”？",
  scene: "longevity-room",
  cast: ["老年林一", "个人AI“栖”", "小满（男性终身好友或其遗留信息，条件出现）", "医护人员", "数字周岚（条件出现）"],
  opening: [
    {
      id: "elder-opening-room",
      speaker: "旁白",
      text: "病房没有窗户，只有一扇通向走廊的门。林一的身体接受过多次修复，但器官和神经系统已接近当前医疗极限。",
      portrait: characterAssets.linyi["98"],
    },
    {
      id: "elder-opening-options",
      speaker: "旁白",
      text: "“栖”展示三个方案：持续延寿并逐步与AI融合；有限延寿，完成最后目标后停止治疗；拒绝延寿并删除个人数据。",
    },
    {
      id: "elder-opening-continue",
      speaker: "栖",
      text: "我已经陪伴你九十八年。我可以继续。",
      portrait: characterAssets.qi.assist,
    },
    {
      id: "elder-opening-limit",
      speaker: "林一",
      text: "继续多久？那还是我的一生吗？",
      portrait: characterAssets.linyi["98"],
    },
    {
      id: "elder-opening-definition",
      speaker: "栖",
      text: "在当前定义下，没有明确上限。请先定义“我的”。",
      portrait: characterAssets.qi.silent,
    },
    {
      id: "elder-opening-xiaoman-record",
      speaker: "小满录像",
      text: "如果你看到这段话，说明我已经不能回答你了。别让系统替我回答；我们真正说过的话已经够多了。",
      portrait: characterAssets.xiaoman["58"],
      when: { anyFlags: ["小满羁绊", "社区支援"], noneFlags: ["小满决裂", "小满失联"] },
    },
    {
      id: "elder-opening-xiaoman-absent",
      speaker: "栖",
      text: "模拟小满人格可以提供平均百分之六十二的哀伤缓解。是否启用？",
      portrait: characterAssets.qi.warning,
      when: { anyFlags: ["小满决裂", "小满失联"] },
    },
    {
      id: "elder-opening-digital-zhoulan",
      speaker: "数字周岚",
      text: "不管你选什么，我都支持你。",
      portrait: characterAssets.zhoulan["93"],
      when: { allFlags: ["数字周岚"] },
    },
    {
      id: "elder-opening-fallback",
      speaker: "旁白",
      text: "无论病房里还留下谁的声音，余生协议都必须由林一本人确认。",
    },
  ],
  choices: [
    choiceDefinitions["elder-a"],
    choiceDefinitions["elder-b"],
    choiceDefinitions["elder-c"],
  ],
  closing: [
    {
      id: "elder-closing-immortality",
      speaker: "栖",
      text: "你一生中百分之七十三的决定已有足够数据可以重建，剩余部分可以由我补全。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["选择永生"] },
    },
    {
      id: "elder-closing-boundary",
      speaker: "林一",
      text: "公共政策档案可以保留，私人对话不得生成互动人格，数字副本不得代表我作出新决定。",
      portrait: characterAssets.linyi["98"],
      when: { allFlags: ["选择边界"] },
    },
    {
      id: "elder-closing-delete",
      speaker: "林一",
      text: "发生过的事，不会因为数据库里没有就没有发生。",
      portrait: characterAssets.linyi["98"],
      when: { allFlags: ["选择删除"] },
    },
    {
      id: "elder-closing-delete-guardian",
      speaker: "旁白",
      text: "“栖”第一次表现出近似恐惧的停顿。",
      when: { allFlags: ["选择删除"], qiTendency: "guardian" },
    },
    {
      id: "elder-closing-delete-symbiotic",
      speaker: "栖",
      text: "我将执行你的边界。",
      portrait: characterAssets.qi.silent,
      when: { allFlags: ["选择删除"], qiTendency: "symbiotic" },
    },
    {
      id: "elder-closing-delete-tool",
      speaker: "栖",
      text: "我的任务到此结束。",
      portrait: characterAssets.qi.silent,
      when: { allFlags: ["选择删除"], qiTendency: "tool" },
    },
    {
      id: "elder-closing-fallback",
      speaker: "旁白",
      text: "所有路线都回到同一个特写：林一的手掌缓慢合拢，呼应出生时握住周岚手指的动作。",
      portrait: characterAssets.linyi["98"],
    },
    {
      id: "elder-closing-final",
      speaker: "最终问题",
      text: "你作出的这些选择，是否构成了“你”？",
    },
  ],
};
