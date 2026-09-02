import type { ChapterDefinition } from "../../game/model";
import { characterAssets } from "../assets";
import { choiceDefinitions } from "../choices";

export const adulthoodChapter: ChapterDefinition = {
  id: "adulthood",
  order: 5,
  year: 2114,
  age: 38,
  title: "壮年期——最后一个工作日",
  location: "林一的工作场所、海岚市公共服务大厅、虚拟世界“昼海”",
  question: "当工作不再决定你能否活着，它是否仍决定你是谁？",
  scene: "work-service",
  choiceScenes: { C: "day-sea" },
  cast: ["林一", "小满（38岁男性朋友，条件出现）", "周岚", "同事或社区成员", "个人AI“栖”"],
  opening: [
    {
      id: "adulthood-opening-law",
      speaker: "系统公告",
      text: "《基础生活保障升级法》生效：住房、标准食物、基础医疗和公共交通由自动化系统免费提供。",
    },
    {
      id: "adulthood-opening-last-day",
      speaker: "旁白",
      text: "新一代AI可以接管林一所在行业百分之八十以上的任务。今天是现有岗位的最后一个完整工作日。",
      portrait: characterAssets.linyi["38"],
    },
    {
      id: "adulthood-opening-designer",
      speaker: "旁白",
      text: "新模型已经能自动生成更受信任的机器人性格，连“适度的不完美”也能模拟。",
      when: { allFlags: ["人格设计师"] },
    },
    {
      id: "adulthood-opening-adviser",
      speaker: "旁白",
      text: "AI已经学会模仿共情话术，但法律仍要求人类签署最终责任。",
      when: { allFlags: ["决策顾问"] },
    },
    {
      id: "adulthood-opening-community",
      speaker: "旁白",
      text: "机器人可以完成照护动作，却无法决定社区应优先帮助谁。",
      when: { allFlags: ["社区工作者"] },
    },
    {
      id: "adulthood-opening-fallback",
      speaker: "栖",
      text: "你的基本生活不受影响。继续工作不再具有生存必要性。",
      portrait: characterAssets.qi.assist,
    },
    {
      id: "adulthood-opening-linyi",
      speaker: "林一",
      text: "那我明天早上为什么还要起床？",
      portrait: characterAssets.linyi["38"],
    },
    {
      id: "adulthood-opening-goal",
      speaker: "栖",
      text: "我可以为你生成新的目标。",
      portrait: characterAssets.qi.assist,
    },
    {
      id: "adulthood-opening-reply",
      speaker: "林一",
      text: "我问的不是你能给我什么目标。",
      portrait: characterAssets.linyi["38"],
    },
  ],
  choices: [
    choiceDefinitions["adulthood-a"],
    choiceDefinitions["adulthood-b"],
    choiceDefinitions["adulthood-c"],
  ],
  closing: [
    {
      id: "adulthood-closing-platform",
      speaker: "栖",
      text: "我已替你完成二百一十七项低风险确认。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["平台管理者"] },
    },
    {
      id: "adulthood-closing-platform-contract",
      speaker: "旁白",
      text: "这是最优人生合同的自然晋升，林一因此获得最高保障。",
      when: { allFlags: ["平台管理者", "最优人生合同"] },
    },
    {
      id: "adulthood-closing-platform-underground",
      speaker: "平台AI",
      text: "你曾帮助删除记录。平台要求公开全部私人数据以证明忠诚。",
      when: { allFlags: ["平台管理者", "地下互助"] },
    },
    {
      id: "adulthood-closing-platform-friend",
      speaker: "小满",
      text: "你不是不工作了，你只是变成了系统需要的那个人类签名。",
      portrait: characterAssets.xiaoman["38"],
      when: { allFlags: ["平台管理者", "小满羁绊"], noneFlags: ["小满决裂", "小满失联"] },
    },
    {
      id: "adulthood-closing-service",
      speaker: "林一",
      text: "机器的反对意见也应公开保存，但它不能替承担关系后果的人作最终决定。",
      portrait: characterAssets.linyi["38"],
      when: { allFlags: ["公共服务"] },
    },
    {
      id: "adulthood-closing-service-adviser",
      speaker: "旁白",
      text: "过往的决策顾问经验让林一成为合作社主持人。",
      when: { allFlags: ["公共服务", "决策顾问"] },
    },
    {
      id: "adulthood-closing-service-community",
      speaker: "旁白",
      text: "林一所在的线下社区成员加入合作社，把现实照护经验带进审查。",
      when: { allFlags: ["公共服务", "社区工作者"] },
    },
    {
      id: "adulthood-closing-service-community-friend",
      speaker: "旁白",
      text: "小满也和线下社区一同加入合作社。",
      portrait: characterAssets.xiaoman["38"],
      when: {
        allFlags: ["公共服务", "社区工作者", "小满羁绊"],
        noneFlags: ["小满决裂", "小满失联"],
      },
    },
    {
      id: "adulthood-closing-service-designer",
      speaker: "旁白",
      text: "林一公开人格设计师行业的内部设计方法，并因此失去部分商业收入。",
      when: { allFlags: ["公共服务", "人格设计师"] },
    },
    {
      id: "adulthood-closing-day-sea",
      speaker: "昼海系统",
      text: "你已新增四千二百名兴趣相似的朋友。",
      when: { allFlags: ["昼海居民"] },
    },
    {
      id: "adulthood-closing-day-sea-friend",
      speaker: "小满",
      text: "我不反对你去那里。我只是希望你还记得回来需要走哪条路。",
      portrait: characterAssets.xiaoman["38"],
      when: { allFlags: ["昼海居民", "小满羁绊"], noneFlags: ["小满决裂", "小满失联"] },
    },
    {
      id: "adulthood-closing-isolated",
      speaker: "旁白",
      text: "数万名虚拟朋友发送AI生成的生日祝福，却没有人敲门。",
      when: { allFlags: ["昼海居民", "现实孤立"] },
    },
    {
      id: "adulthood-closing-fallback",
      speaker: "旁白",
      text: "深夜，周岚发来通话请求。她只想讲照护机器人把自己种的花当作垃圾清理了。",
      portrait: characterAssets.zhoulan["58"],
    },
    {
      id: "adulthood-closing-call",
      speaker: "旁白",
      text: "两个未定画面并列停留：一个是接听后关于“为什么有些东西必须亲自照顾”的对话，另一个是“栖”生成稍后回复、周岚只说“知道你忙”。叙事不指定哪个已经发生。",
    },
  ],
};
