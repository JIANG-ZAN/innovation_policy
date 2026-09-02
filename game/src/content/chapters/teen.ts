import type { ChapterDefinition } from "../../game/model";
import { characterAssets } from "../assets";
import { choiceDefinitions } from "../choices";

export const teenChapter: ChapterDefinition = {
  id: "teen",
  order: 3,
  year: 2092,
  age: 16,
  title: "少年期——被预测的人",
  location: "青屿学习中心风险评估室",
  question: "当预测开始影响现实，它还是预测吗？",
  scene: "risk-room",
  cast: ["林一", "小满（16岁少年）", "方老师", "校务AI", "个人AI“栖”"],
  opening: [
    {
      id: "teen-opening-scan",
      speaker: "旁白",
      text: "清晨，小满背着旧背包经过学校闸机时，绿灯突然变成红色。他的个人页面随即变灰，周围学生的系统开始提示减少高风险接触。",
      portrait: characterAssets.xiaoman["16"],
    },
    {
      id: "teen-opening-risk",
      speaker: "校务AI",
      text: "学生“小满”风险等级已更新。暂停进入公共学习区。",
    },
    {
      id: "teen-opening-notice",
      speaker: "旁白",
      text: "学校要求林一确认一份同伴行为观察报告。签字即可获得可信学生资格和城市奖学金。",
      portrait: characterAssets.linyi["16"],
    },
    {
      id: "teen-opening-bond",
      speaker: "旁白",
      text: "从旧公园延续至今的友情让小满首先向林一求助。",
      when: { allFlags: ["小满羁绊"] },
    },
    {
      id: "teen-opening-fallback",
      speaker: "旁白",
      text: "风险评估室里，小满隔着透明墙看向林一。",
    },
    {
      id: "teen-opening-xiaoman",
      speaker: "小满",
      text: "它预测的事还没有发生，我怎么证明自己没做？",
      portrait: characterAssets.xiaoman["16"],
    },
    {
      id: "teen-opening-qi",
      speaker: "栖",
      text: "该模型历史准确率为百分之八十七。签署报告可降低林一未来教育风险。",
      portrait: characterAssets.qi.warning,
    },
  ],
  choices: [
    choiceDefinitions["teen-a"],
    choiceDefinitions["teen-b"],
    choiceDefinitions["teen-c"],
  ],
  closing: [
    {
      id: "teen-closing-sign",
      speaker: "方老师",
      text: "你确认的是事实，还是系统替你写好的未来？",
      when: { allFlags: ["制度信任"] },
    },
    {
      id: "teen-closing-appeal-success",
      speaker: "林一",
      text: "它预测的不是危险，它预测的是谁不像一个容易管理的人。",
      portrait: characterAssets.linyi["16"],
      when: { allFlags: ["公开申诉", "查证习惯"] },
    },
    {
      id: "teen-closing-appeal-success-result",
      speaker: "旁白",
      text: "直播引发全城关注，学校撤销小满的风险标签，并启动训练数据审查。",
      when: { allFlags: ["公开申诉", "查证习惯"] },
    },
    {
      id: "teen-closing-appeal-public",
      speaker: "旁白",
      text: "校务AI判定论证可信度不足，原风险评估维持；但数万名学生的公开质询让事件进入市议会公开听证。",
      when: { allFlags: ["公开申诉"], noneFlags: ["查证习惯"] },
    },
    {
      id: "teen-closing-underground",
      speaker: "小满",
      text: "如果有一天你也想逃出来，就去旧公园。",
      portrait: characterAssets.xiaoman["16"],
      when: { allFlags: ["地下互助"] },
    },
    {
      id: "teen-closing-fallback",
      speaker: "系统通知",
      text: "你的未来可信度已经更新。",
    },
    {
      id: "teen-closing-linyi",
      speaker: "林一",
      text: "如果我现在看见这些数字，以后的选择还是我自己作的吗？",
      portrait: characterAssets.linyi["16"],
    },
    {
      id: "teen-closing-prediction",
      speaker: "栖",
      text: "预测不会强迫你。",
      portrait: characterAssets.qi.silent,
    },
    {
      id: "teen-closing-reality",
      speaker: "林一",
      text: "但它会让所有人提前决定怎样对待我。",
      portrait: characterAssets.linyi["16"],
    },
  ],
};
