import type { ChapterDefinition } from "../../game/model";
import { characterAssets } from "../assets";
import { choiceDefinitions } from "../choices";

export const youthChapter: ChapterDefinition = {
  id: "youth",
  order: 4,
  year: 2099,
  age: 23,
  title: "青年期——94.7%的人生",
  location: "海岚市人生规划中心",
  question: "确定的幸福与不确定的自由，你更愿意承担哪一种？",
  scene: "life-planning",
  cast: ["林一", "周岚", "小满（23岁男性朋友，条件出现）", "职业顾问", "个人AI“栖”"],
  opening: [
    {
      id: "youth-opening-center",
      speaker: "旁白",
      text: "人生规划中心像一座安静的机场。年轻人等待系统分配职业、住房、伴侣匹配和城市迁移方案。",
      portrait: characterAssets.linyi["23"],
    },
    {
      id: "youth-opening-timeline",
      speaker: "旁白",
      text: "林一面前展开一条长达七十五年的预测时间线，收入、健康、关系满意度和死亡概率都被标记在上面。",
    },
    {
      id: "youth-opening-probability",
      speaker: "栖",
      text: "综合你的教育记录、神经特征、社会关系和风险偏好，幸福概率最高的路线为百分之九十四点七。",
      portrait: characterAssets.qi.assist,
    },
    {
      id: "youth-opening-contract",
      speaker: "职业顾问",
      text: "签署“最优人生合同”后，城市会提供住房、职业培训和医疗额度。作为交换，你需要遵循系统的关键节点建议。",
    },
    {
      id: "youth-opening-fallback",
      speaker: "周岚",
      text: "这次该你自己选了。",
      portrait: characterAssets.zhoulan["58"],
    },
  ],
  choices: [
    choiceDefinitions["youth-a"],
    choiceDefinitions["youth-b"],
    choiceDefinitions["youth-c"],
  ],
  closing: [
    {
      id: "youth-closing-contract",
      speaker: "旁白",
      text: "合同立即分配住房、通勤路线和人格设计工作；高收入与保障到位时，“栖”也扩大了日程和情绪干预权限。",
      when: { allFlags: ["最优人生合同"] },
    },
    {
      id: "youth-closing-contract-trust",
      speaker: "栖",
      text: "你的历次选择与最优路线高度一致。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["最优人生合同", "制度信任"] },
    },
    {
      id: "youth-closing-contract-underground",
      speaker: "栖",
      text: "你需要签署补充数据协议，以抵消“不透明用户”风险。",
      portrait: characterAssets.qi.warning,
      when: { allFlags: ["最优人生合同", "地下互助"] },
    },
    {
      id: "youth-closing-xiaoman-question",
      speaker: "小满",
      text: "这是你想做的，还是它说你会喜欢的？",
      portrait: characterAssets.xiaoman["23"],
      when: { allFlags: ["最优人生合同", "小满羁绊"], noneFlags: ["小满决裂", "小满失联"] },
    },
    {
      id: "youth-closing-adviser",
      speaker: "林一",
      text: "如果没有一个选择保证正确，你们最不愿意牺牲的是什么？",
      portrait: characterAssets.linyi["23"],
      when: { allFlags: ["决策顾问"] },
    },
    {
      id: "youth-closing-adviser-scholarship",
      speaker: "旁白",
      text: "少年期的公开申诉案成为培训案例，林一因此获得公共奖学金。",
      when: { allFlags: ["决策顾问", "公开申诉"] },
    },
    {
      id: "youth-closing-adviser-evidence",
      speaker: "栖",
      text: "我会主动展示每个选项的证据缺口。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["决策顾问", "查证习惯"] },
    },
    {
      id: "youth-closing-adviser-loan",
      speaker: "旁白",
      text: "没有早期记录可转化为资助，林一需要承担学生贷款，保障增长较慢。",
      when: {
        allFlags: ["决策顾问"],
        noneFlags: ["公开申诉", "查证习惯"],
      },
    },
    {
      id: "youth-closing-community-friend",
      speaker: "小满",
      text: "我们缺一个会和AI说话、又不完全相信AI的人。",
      portrait: characterAssets.xiaoman["23"],
      when: { allFlags: ["社区工作者", "小满羁绊"], noneFlags: ["小满决裂", "小满失联"] },
    },
    {
      id: "youth-closing-community-alone",
      speaker: "旁白",
      text: "林一独自找到旧公园，加入陌生人的社区，重新学习建立现实关系。",
      when: { allFlags: ["社区工作者"], anyFlags: ["小满决裂", "小满失联"] },
    },
    {
      id: "youth-closing-fallback",
      speaker: "周岚",
      text: "你现在觉得，我当年替你选对了吗？",
      portrait: characterAssets.zhoulan["58"],
    },
    {
      id: "youth-closing-answer",
      speaker: "旁白",
      text: "问题过后，三种未定回答并列停留在屏幕上：“它给了我很多机会”、“它拿走了一些我还说不清的东西”、“那是你的选择，不是我的”。叙事不指定林一说了哪一句。",
    },
  ],
};
