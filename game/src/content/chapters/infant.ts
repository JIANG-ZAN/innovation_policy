import type { ChapterDefinition } from "../../game/model";
import { characterAssets } from "../assets";
import { choiceDefinitions } from "../choices";

export const infantChapter: ChapterDefinition = {
  id: "infant",
  order: 1,
  year: 2076,
  age: 0,
  title: "婴儿期——出生协议",
  location: "海岚市安澜医院，新生儿智能监护室",
  question: "一个人尚不能同意时，谁可以替他决定未来？",
  scene: "birth",
  cast: ["婴儿林一", "周岚", "陈医生", "个人AI“栖”"],
  opening: [
    {
      id: "infant-opening-date",
      speaker: "系统字幕",
      text: "2076年4月17日，海岚市。第2,814名今日新生儿。",
    },
    {
      id: "infant-opening-welcome",
      speaker: "栖",
      text: "生命体征稳定。欢迎来到海岚市，林一。",
      portrait: characterAssets.qi.assist,
    },
    {
      id: "infant-opening-doctor",
      speaker: "陈医生",
      text: "知识芯片由城市免费提供。它会持续监测健康，也能让孩子直接调用公共知识库。",
    },
    {
      id: "infant-opening-zhoulan",
      speaker: "周岚",
      text: "免费到什么时候？",
      portrait: characterAssets.zhoulan["35"],
    },
    {
      id: "infant-opening-cost",
      speaker: "陈医生",
      text: "终身免费。作为交换，芯片产生的数据会用于训练城市模型；成年后可以申请撤回，但目前还没有成功案例。",
    },
    {
      id: "infant-opening-forecast",
      speaker: "栖",
      text: "接受全量植入可使林一的预期健康寿命增加十二年，教育机会提升百分之三十一。",
      portrait: characterAssets.qi.warning,
    },
    {
      id: "infant-opening-narrator",
      speaker: "旁白",
      text: "你还不会说话。这是别人替你作出的第一个选择；多年以后，你只能承担它的结果。",
      portrait: characterAssets.linyi["00"],
    },
  ],
  choices: [
    choiceDefinitions["infant-a"],
    choiceDefinitions["infant-b"],
    choiceDefinitions["infant-c"],
  ],
  closing: [
    {
      id: "infant-closing-full-chip",
      speaker: "栖",
      text: "连接完成。从现在起，我会帮助你避免可以避免的错误。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["全量芯片"] },
    },
    {
      id: "infant-closing-guardian-chip",
      speaker: "栖",
      text: "监护模式已启用。未经人类确认，我不会替林一执行重要决定。",
      portrait: characterAssets.qi.assist,
      when: { allFlags: ["监护型芯片"] },
    },
    {
      id: "infant-closing-no-implant",
      speaker: "栖",
      text: "我会在终端中等待。只有被呼叫时，我才会出现。",
      portrait: characterAssets.qi.silent,
      when: { allFlags: ["无植入"] },
    },
    {
      id: "infant-closing-fallback",
      speaker: "旁白",
      text: "无论协议如何落定，周岚都把手指放进婴儿掌心，林一本能地握住她。",
      portrait: characterAssets.linyi["00"],
    },
    {
      id: "infant-closing-promise",
      speaker: "周岚",
      text: "以后如果你觉得我选错了，你可以怪我。",
      portrait: characterAssets.zhoulan["35"],
    },
    {
      id: "infant-closing-record",
      speaker: "栖",
      text: "记录完成。事件名称：第一次选择。",
      portrait: characterAssets.qi.silent,
    },
  ],
};
