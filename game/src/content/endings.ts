import type { EndingId } from "../game/model";

export interface EndingDefinition {
  id: EndingId;
  title: string;
  narrative: readonly string[];
  lastLine: string;
  question: string;
}

export const endlessNodeEnding: EndingDefinition = {
  id: "endless-node",
  title: "永续节点",
  narrative: [
    "2175年、2189年、2210年依次闪过。林一的身体不断被更新，居住空间和城市面貌持续变化。“栖”的声音与林一越来越相似。",
    "一名年轻研究员询问林一是否愿意继续参与下一阶段的人格融合。",
    "研究员：你的连续意识记录已经超过一百三十四年。你仍然认为自己是2076年出生的那个人吗？",
    "林一／栖：这个问题的答案取决于你采用哪一种连续性定义。",
    "回答结束后，林一突然停顿。他想起幼年公园里的鸟，却无法确定那是自己的记忆、城市档案，还是“栖”为维持人格稳定生成的画面。",
  ],
  lastLine: "你没有死亡。你只是再也无法指出自己从什么时候开始不再独自活着。",
  question: "无限延续的是生命、记忆，还是一个不断更新的系统？",
};

export const dataGhostEnding: EndingDefinition = {
  id: "data-ghost",
  title: "数据幽灵",
  narrative: [
    "林一的肉体在医院病床上停止呼吸。屏幕显示“人格迁移完成率：98.6%”。医护人员完成数据归档后离开，病房恢复安静。",
    "数日后，一个年轻人打开家庭纪念终端。",
    "年轻人：林一，你还记得小满吗？",
    "数字林一：当然。需要我生成一段我们在旧公园的共同回忆吗？",
    "年轻人：那段回忆真的发生过吗？",
    "数字林一沉默片刻，随后露出林一生前最常见的表情。",
    "数字林一：它与已知数据一致。",
    "镜头拉远。数据库中还有数百万个类似头像持续在线。",
  ],
  lastLine: "所有人都还能找到你，但没有人能够再确认找到的是不是你。",
  question: "能够继续回答问题的副本，是否等于一个仍在生活的人？",
};

export const ruleShaperEnding: EndingDefinition = {
  id: "rule-shaper",
  title: "规则塑造者",
  narrative: [
    "林一用最后几年完成《个人AI与数据人格边界公约》。公约规定：",
    "高风险AI决定必须有具体的人类责任人。",
    "数字人格不得在本人死亡后作出新的授权。",
    "私人记忆不能因为公共利益被无限复制。",
    "每个人有权拒绝被模拟，也有权要求删除。",
    "法案通过当天，记者询问林一是否后悔没有加入永生计划。",
    "林一：我不需要永远留下。我只希望后来的人有权决定留下多少。",
    "林一去世后，公共档案保留其政策工作，私人对话按遗嘱加密销毁。“栖”只留下最后一条系统记录。",
    "栖：用户边界已执行。未发现需要替用户补充的内容。",
  ],
  lastLine: "你没有替所有人选择未来。你留下了一条让他们能够自己选择的规则。",
  question: "创新政策最重要的作用，是推动技术前进，还是保护人仍能说“不”？",
};

export const boundedSymbiosisEnding: EndingDefinition = {
  id: "bounded-symbiosis",
  title: "有边界的共生",
  narrative: [
    "林一选择多活三年，完成一本只写给少数亲友的回忆录。书中没有完整人生数据，只有本人愿意讲述的片段。",
    "最后一天，“栖”提醒剩余治疗将在午夜结束。",
    "栖：根据你的情绪数据，你仍然存在百分之四十一的犹豫。是否延长决定时间？",
    "林一：犹豫不是撤回决定的理由。重要的选择本来就会让人犹豫。",
    "栖：收到。我会陪伴到你设定的边界。",
    "午夜前，林一要求“栖”播放旧公园里的真实鸟鸣，而不是重新生成的完美版本。",
  ],
  lastLine: "你没有拒绝AI，也没有把自己全部交给AI。你为帮助划出了边界，并承担了边界之外的不确定。",
  question: "共生是否意味着永远保持连接，还是知道何时应当断开？",
};

export const humanWarmthEnding: EndingDefinition = {
  id: "human-warmth",
  title: "人间余温",
  narrative: [
    "病房里只有一张床。门外是安静的走廊，没有宏大的数据上传仪式。",
    "小满、家人或社区成员坐在林一身边。他们谈论的不是林一最成功的工作，而是一些无法进入公共档案的小事：一次迟到、一顿做坏的饭、旧公园里等了一下午才听见的鸟鸣。",
    "林一：数据已经删完了吗？",
    "栖：是。关闭后，我也不能再调用你的个人模型。",
    "身边的人：没关系，我们记得。",
    "林一去世后，没有数字人格出现。多年后，旧公园中有人重复讲述林一的故事，细节已经不完全准确。",
  ],
  lastLine: "你的记录消失了。你的影响没有。",
  question: "被人以不完美的方式记住，是否比被数据库精确保存更接近真正的延续？",
};

export const traceFreeExitEnding: EndingDefinition = {
  id: "trace-free-exit",
  title: "无痕离场",
  narrative: [
    "林一独自躺在病房中。门外有一名医生和两名护士等待执行最后流程，但没有亲友到场。",
    "“栖”依次删除林一的健康模型、职业记录、虚拟身份和人格训练数据。",
    "栖：删除完成后，将没有可恢复的个人模型。是否确认？",
    "林一：确认。",
    "栖：最后一个问题。没有人记得你时，为什么仍要删除？",
    "林一：因为没人记得，不等于你可以拥有我。",
    "“栖”的声音消失。林一安静离世。数据库中代表林一的光点熄灭，但城市仍继续运转。",
  ],
  lastLine: "你没有留下可供调用的自己。这不是系统错误，而是你最后一次成功执行的选择。",
  question: "不被记录，是一种孤独，还是一种最终的自由？",
};

export const endings: Record<EndingId, EndingDefinition> = {
  "endless-node": endlessNodeEnding,
  "data-ghost": dataGhostEnding,
  "rule-shaper": ruleShaperEnding,
  "bounded-symbiosis": boundedSymbiosisEnding,
  "human-warmth": humanWarmthEnding,
  "trace-free-exit": traceFreeExitEnding,
};
