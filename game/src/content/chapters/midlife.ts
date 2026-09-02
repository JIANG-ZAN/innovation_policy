import type { ChapterDefinition } from "../../game/model";
import { characterAssets } from "../assets";
import { choiceDefinitions } from "../choices";

export const midlifeChapter: ChapterDefinition = {
  id: "midlife",
  order: 6,
  year: 2134,
  age: 58,
  title: "中年期——谁为正确负责",
  location: "安澜医院医疗决策室、海岚市公共听证频道",
  question: "正确的计算可以免除人的责任吗？",
  scene: "medical-room",
  cast: ["林一", "93岁的周岚", "小满（58岁男性朋友，条件出现）", "陈医生的数字助理", "个人AI“栖”"],
  opening: [
    {
      id: "midlife-opening-illness",
      speaker: "旁白",
      text: "周岚因器官衰竭住院。新的人工器官可以让她多活八到十二年，但城市医疗AI拒绝分配手术资源。",
      portrait: characterAssets.zhoulan["93"],
    },
    {
      id: "midlife-opening-calculation",
      speaker: "医疗AI",
      text: "预计新增健康寿命：6.3年。资源机会成本：可用于四名年轻患者；综合公共收益低于批准阈值。",
    },
    {
      id: "midlife-opening-question",
      speaker: "周岚",
      text: "它说得有道理吗？",
      portrait: characterAssets.zhoulan["93"],
    },
    {
      id: "midlife-opening-answer",
      speaker: "林一",
      text: "它算得出来。",
      portrait: characterAssets.linyi["58"],
    },
    {
      id: "midlife-opening-distinction",
      speaker: "周岚",
      text: "我问的是有没有道理。",
      portrait: characterAssets.zhoulan["93"],
    },
    {
      id: "midlife-opening-review-channel",
      speaker: "栖",
      text: "你拥有正式医疗申诉渠道，但持续申诉会消耗家庭资源。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["决策顾问"] },
    },
    {
      id: "midlife-opening-public-precedent",
      speaker: "栖",
      text: "少年期公开申诉案可以作为算法审查先例。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["公开申诉"] },
    },
    {
      id: "midlife-opening-fallback",
      speaker: "旁白",
      text: "市议会同时讨论《人类最终责任法》，要求高风险决定由具体的人类签名并说明理由。",
    },
  ],
  choices: [
    choiceDefinitions["midlife-a"],
    choiceDefinitions["midlife-b"],
    choiceDefinitions["midlife-c"],
  ],
  closing: [
    {
      id: "midlife-closing-accept",
      speaker: "周岚",
      text: "那你要记住，这是你的决定。别以后都怪给机器。",
      portrait: characterAssets.zhoulan["93"],
      when: { allFlags: ["接受医疗判定"] },
    },
    {
      id: "midlife-closing-digital",
      speaker: "数字周岚",
      text: "今天过得怎么样？",
      portrait: characterAssets.zhoulan["93"],
      when: { allFlags: ["数字周岚"] },
    },
    {
      id: "midlife-closing-digital-generated",
      speaker: "旁白",
      text: "接受判定路线中，系统已默认生成数字周岚，并在角落标注“生成内容，非本人意识延续”。",
      when: { allFlags: ["接受医疗判定", "数字周岚"] },
    },
    {
      id: "midlife-closing-review-success",
      speaker: "林一",
      text: "我没有证明她更值得活。我只是证明，模型漏算了什么。",
      portrait: characterAssets.linyi["58"],
      when: { allFlags: ["人类复核", "复核胜诉"] },
    },
    {
      id: "midlife-closing-review-failure",
      speaker: "周岚",
      text: "不是所有失败都等于白做。",
      portrait: characterAssets.zhoulan["93"],
      when: { allFlags: ["人类复核"], noneFlags: ["复核胜诉"] },
    },
    {
      id: "midlife-closing-illegal-supported",
      speaker: "小满",
      text: "我们帮的不是一个人逃过规则，是逼规则承认它看不见的人。",
      portrait: characterAssets.xiaoman["58"],
      when: {
        allFlags: ["非法治疗", "社区支援", "小满羁绊"],
        noneFlags: ["小满决裂", "小满失联"],
      },
    },
    {
      id: "midlife-closing-illegal-community",
      speaker: "社区成员",
      text: "社区成员和旧友网络共同提供照护、法律援助和资源，让这场违法救治成为对申诉机会的公共追问。",
      when: {
        allFlags: ["非法治疗", "社区支援"],
        noneFlags: ["小满羁绊"],
      },
    },
    {
      id: "midlife-closing-illegal-alone",
      speaker: "周岚",
      text: "我想活，但我没让你把余生都赔给我。",
      portrait: characterAssets.zhoulan["93"],
      when: { allFlags: ["非法治疗", "制度惩罚"] },
    },
    {
      id: "midlife-closing-fallback",
      speaker: "旁白",
      text: "多年后，周岚最终离世。她的房间里留下出生协议签署时的影像。",
    },
    {
      id: "midlife-closing-boundary-review",
      speaker: "旁白",
      text: "人类复核路线中，对数字人格的处置在这里只作为一个未决问题：林一是否采用“只保留语音档案、不生成互动人格”这个组合方案。镜头不确认他的最终处置，也不作为后续已发生的事实。",
      when: { allFlags: ["人类复核"] },
    },
    {
      id: "midlife-closing-boundary-illegal",
      speaker: "周岚预留指令",
      text: "周岚预先留下边界指令：“不要让一个模型替我继续当你的母亲。”镜头保留这句话，但尚未说明林一是否遵从，也不断言最终处置。",
      portrait: characterAssets.zhoulan["93"],
      when: { allFlags: ["非法治疗"] },
    },
  ],
};
