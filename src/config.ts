import { Schema } from "koishi";

export enum FishQuality {
    rotten = "rotten",
    moldy = "moldy",
    common = "common",
    golden = "golden",
    void = "void",
    hidden_fire = "hidden_fire"
}

export enum FishingRodLevel {
    normal = "normal",
    silver = "silver",
    gold = "gold",
    holy = "holy",
    void = "void"
}

export interface FishingRodConfig {
    name: string;
    display: string;
    upgrade_requirement: number; // 升级所需钓鱼次数
    quality_bonus: Record<FishQuality, number>; // 品质加成系数
    downgrade_probability: number; // 基础降级概率
    special_fish_bonus: number; // 特殊鱼类概率加成
}

export interface FishInfo {
    name: string;
    prompt?: string; // 特殊描述，如果有则优先显示
}

export interface QualityConfig {
    name: string;
    display: string;
    weight: number;
    price: number;
    lengthRange: [number, number];
    fishes: FishInfo[];
}

export interface Fish {
    name: string;
    quality: FishQuality;
    length: number;
}

export interface Config {
    base_weight_increase: number;
    max_weight: number;
    fishing_cooldown: number;
    // 鱼竿相关配置
    fishing_rods: Record<FishingRodLevel, FishingRodConfig>;
    downgrade_events: {
        bad_fish_names: string[]; // 导致降级的倒霉鱼名称
        consecutive_bad_threshold: number; // 连续钓到低品质鱼的降级阈值
        inactivity_days: number; // 不活跃天数导致降级
    };
}

export const Config: Schema<Config> = Schema.object({
    base_weight_increase: Schema.number().default(1.9).description("基础权重增加值 (指数函数)"),
    max_weight: Schema.number().default(1000).description("最大权重，超过此值将被限制"),
    fishing_cooldown: Schema.number().default(15).description("钓鱼冷却时间，单位秒"),

    fishing_rods: Schema.object({
        normal: Schema.object({
            name: Schema.string().default("normal").description("鱼竿内部标识符"),
            display: Schema.string().default("普通").description("鱼竿显示名称"),
            upgrade_requirement: Schema.number().default(50).description("升级到下一级鱼竿所需的钓鱼次数"),
            quality_bonus: Schema.object({
                rotten: Schema.number().default(1).description("腐烂品质鱼类的权重加成系数"),
                moldy: Schema.number().default(1).description("发霉品质鱼类的权重加成系数"),
                common: Schema.number().default(1).description("普通品质鱼类的权重加成系数"),
                golden: Schema.number().default(1).description("金品质鱼类的权重加成系数"),
                void: Schema.number().default(1).description("虚空品质鱼类的权重加成系数"),
                hidden_fire: Schema.number().default(1).description("隐火品质鱼类的权重加成系数")
            }).description("各品质鱼类的权重加成"),
            downgrade_probability: Schema.number().default(0.02).description("鱼竿降级的基础概率"),
            special_fish_bonus: Schema.number().default(1).description("特殊鱼类的概率加成系数")
        }).description("普通鱼竿配置"),
        silver: Schema.object({
            name: Schema.string().default("silver").description("鱼竿内部标识符"),
            display: Schema.string().default("银").description("鱼竿显示名称"),
            upgrade_requirement: Schema.number().default(150).description("升级到下一级鱼竿所需的钓鱼次数"),
            quality_bonus: Schema.object({
                rotten: Schema.number().default(0.9).description("腐烂品质鱼类的权重加成系数"),
                moldy: Schema.number().default(0.95).description("发霉品质鱼类的权重加成系数"),
                common: Schema.number().default(1.1).description("普通品质鱼类的权重加成系数"),
                golden: Schema.number().default(1.2).description("金品质鱼类的权重加成系数"),
                void: Schema.number().default(1.1).description("虚空品质鱼类的权重加成系数"),
                hidden_fire: Schema.number().default(1.1).description("隐火品质鱼类的权重加成系数")
            }).description("各品质鱼类的权重加成"),
            downgrade_probability: Schema.number().default(0.015).description("鱼竿降级的基础概率"),
            special_fish_bonus: Schema.number().default(1.1).description("特殊鱼类的概率加成系数")
        }).description("银鱼竿配置"),
        gold: Schema.object({
            name: Schema.string().default("gold").description("鱼竿内部标识符"),
            display: Schema.string().default("金").description("鱼竿显示名称"),
            upgrade_requirement: Schema.number().default(300).description("升级到下一级鱼竿所需的钓鱼次数"),
            quality_bonus: Schema.object({
                rotten: Schema.number().default(0.8).description("腐烂品质鱼类的权重加成系数"),
                moldy: Schema.number().default(0.9).description("发霉品质鱼类的权重加成系数"),
                common: Schema.number().default(1.15).description("普通品质鱼类的权重加成系数"),
                golden: Schema.number().default(1.4).description("金品质鱼类的权重加成系数"),
                void: Schema.number().default(1.3).description("虚空品质鱼类的权重加成系数"),
                hidden_fire: Schema.number().default(1.2).description("隐火品质鱼类的权重加成系数")
            }).description("各品质鱼类的权重加成"),
            downgrade_probability: Schema.number().default(0.01).description("鱼竿降级的基础概率"),
            special_fish_bonus: Schema.number().default(1.25).description("特殊鱼类的概率加成系数")
        }).description("金鱼竿配置"),
        holy: Schema.object({
            name: Schema.string().default("holy").description("鱼竿内部标识符"),
            display: Schema.string().default("圣物").description("鱼竿显示名称"),
            upgrade_requirement: Schema.number().default(500).description("升级到下一级鱼竿所需的钓鱼次数"),
            quality_bonus: Schema.object({
                rotten: Schema.number().default(0.7).description("腐烂品质鱼类的权重加成系数"),
                moldy: Schema.number().default(0.85).description("发霉品质鱼类的权重加成系数"),
                common: Schema.number().default(1.2).description("普通品质鱼类的权重加成系数"),
                golden: Schema.number().default(1.6).description("金品质鱼类的权重加成系数"),
                void: Schema.number().default(1.5).description("虚空品质鱼类的权重加成系数"),
                hidden_fire: Schema.number().default(1.4).description("隐火品质鱼类的权重加成系数")
            }).description("各品质鱼类的权重加成"),
            downgrade_probability: Schema.number().default(0.008).description("鱼竿降级的基础概率"),
            special_fish_bonus: Schema.number().default(1.5).description("特殊鱼类的概率加成系数")
        }).description("圣物鱼竿配置"),
        void: Schema.object({
            name: Schema.string().default("void").description("鱼竿内部标识符"),
            display: Schema.string().default("虚空").description("鱼竿显示名称"),
            upgrade_requirement: Schema.number()
                .default(-1)
                .description("升级到下一级鱼竿所需的钓鱼次数（-1表示最高级）"),
            quality_bonus: Schema.object({
                rotten: Schema.number().default(0.6).description("腐烂品质鱼类的权重加成系数"),
                moldy: Schema.number().default(0.8).description("发霉品质鱼类的权重加成系数"),
                common: Schema.number().default(1.3).description("普通品质鱼类的权重加成系数"),
                golden: Schema.number().default(1.8).description("金品质鱼类的权重加成系数"),
                void: Schema.number().default(1.8).description("虚空品质鱼类的权重加成系数"),
                hidden_fire: Schema.number().default(1.7).description("隐火品质鱼类的权重加成系数")
            }).description("各品质鱼类的权重加成"),
            downgrade_probability: Schema.number().default(0.005).description("鱼竿降级的基础概率"),
            special_fish_bonus: Schema.number().default(2).description("特殊鱼类的概率加成系数")
        }).description("虚空鱼竿配置（最高级）")
    }).description("鱼竿等级配置"),

    downgrade_events: Schema.object({
        bad_fish_names: Schema.array(Schema.string())
            .default([
                "996福报鱼",
                "抑郁emo鱼",
                "当众社死鱼",
                "纯纯大怨种鱼",
                "Monday Blue鱼",
                "破产倒闭鱼",
                "考公上岸失败鱼",
                "跳票延期鱼",
                "咸鱼本鱼",
                "破防龙虾"
            ])
            .description("可能导致鱼竿降级的倒霉鱼名称列表"),
        consecutive_bad_threshold: Schema.number().default(10).description("连续钓到低品质鱼的降级阈值"),
        inactivity_days: Schema.number().default(7).description("不活跃天数导致降级")
    }).description("鱼竿降级事件配置")
});

export const FISH_CONFIG: Record<FishQuality, QualityConfig> = {
    [FishQuality.rotten]: {
        name: "rotten",
        display: "腐烂",
        weight: 20,
        price: 0.05,
        lengthRange: [15, 45],
        fishes: [
            { name: "996福报鱼", prompt: "* 又是996，又是福报，你钓到了资本家的眼泪..." },
            { name: "摆烂摸鱼", prompt: "* 摆烂就摆烂，为什么还要钓鱼？这不是套娃吗！" },
            { name: "废物螃蟹" },
            { name: "咸鱼本鱼", prompt: "* 咸鱼翻身了！...等等，还是咸鱼。" },
            { name: "破防龙虾" },
            { name: "emo海星", prompt: "* 这条海星总是很emo，仿佛在诉说着生活的无奈..." },
            { name: "空心大白鲨" },
            { name: "社死触手怪" },
            { name: "躺平海参" },
            { name: "孙笑川258鱼" },
            { name: "熬夜猝死鱼", prompt: "* 这条鱼告诉你要早睡，但它自己却熬夜到现在..." },
            { name: "过期老坛酸菜鱼" },
            { name: "纯纯大怨种鱼" },
            { name: "抑郁emo鱼" },
            { name: "低电量焦虑鱼", prompt: "* 这条鱼一直在担心自己的电量，就像你担心手机一样..." },
            { name: "毒河豚" },
            { name: "瘪了的气球鱼" },
            { name: "社畜007鱼" },
            { name: "吃土西北风鱼" },
            { name: "当众社死鱼" },
            { name: "Monday Blue鱼", prompt: "* 这条鱼总是感到Monday Blue，仿佛每周一都在钓鱼..." },
            { name: "破产倒闭鱼" }
        ]
    },
    [FishQuality.moldy]: {
        name: "moldy",
        display: "发霉",
        weight: 15,
        price: 0.08,
        lengthRange: [20, 150],
        fishes: [
            { name: "计算机二级鱼", prompt: "* 这条鱼通过了计算机二级考试，但还是找不到工作..." },
            { name: "专科学历鱼" },
            { name: "i人社恐鱼", prompt: "* 这条鱼不敢和你对视，默默游到角落里..." },
            { name: "Hello World鱼", prompt: "* printf('Hello, Fishing World!'); 这条鱼在向你打招呼！" },
            { name: "Kobe 鱼", prompt: "* 这条鱼在湖人队打过球，但现在已经去往远方了..." },
            { name: "404页面走丢鱼", prompt: "* 页面没找到，但是鱼找到了！" },
            { name: "UI还原度0%鱼" },
            { name: "锦鲤转运鱼" },
            { name: "日式鳗鱼饭" },
            { name: "挪威的森林鲭鱼" },
            { name: "三文鱼刺身" },
            { name: "内卷985鱼" },
            { name: "ChatGPT替代鱼", prompt: "* 这条鱼担心被AI替代，但它忘了自己只是条鱼..." },
            { name: "第三方API寄了鱼" },
            { name: "debug到天亮鱼", prompt: "* 这条鱼陪程序员debug了一整夜，眼睛都红了..." },
            { name: "PTSD逃避鱼" },
            { name: "独居老人鱼" },
            { name: "考公上岸失败鱼" },
            { name: "跳票延期鱼" },
            { name: "ICU加护病房鱼" },
            { name: "死鱼眼麻木鱼" }
        ]
    },
    [FishQuality.common]: {
        name: "common",
        display: "普通",
        weight: 100,
        price: 0.1,
        lengthRange: [1, 30],
        fishes: [
            { name: "尚方宝剑" }, // 保留原有特殊逻辑
            { name: "丁真鱼", prompt: "* 理塘的丁真，为你献上最纯真的鱼！" },
            { name: "鱼", prompt: "* 这条鱼在水中自由自在地游动，仿佛在享受生活" },
            { name: "河" }, // 保留原有特殊逻辑
            { name: "阳光开朗鱼", prompt: "* 这条鱼总是很乐观，感染了你的心情！" },
            { name: "转运锦鲤" },
            { name: "海底捞水母" },
            { name: "天使虾" },
            { name: "深海鲭鱼" },
            { name: "澳洲龙虾" },
            { name: "挪威三文鱼" },
            { name: "yee鱼" },
            { name: "supper面筋鱼" },
            { name: "武昌起义鱼" },
            { name: "大草原草鱼" },
            { name: "青岛青鱼" },
            { name: "胖头鳙鱼" },
            { name: "派大星" },
            { name: "日本鳗鱼" },
            { name: "老干妈海参" },
            { name: "红烧鲷鱼" },
            { name: "白鲢鱼" },
            { name: "大马哈鱼" },
            { name: "龙利鱼柳" },
            { name: "小黄花鱼" },
            { name: "中华田园鱼" },
            { name: "康师傅红烧牛肉面鱼" },
            { name: "沙雕鱼" },
            { name: "无语子鱼" },
            { name: "摸鱼的鱼", prompt: "* 钓鱼的时候钓到了摸鱼的鱼，这算哲学吗？" },
            { name: "海洋馆逃犯" },
            { name: "暴躁小龙虾" },
            { name: "咋就睡不着鱼" },
            { name: "滴滴出行鱼" }
        ]
    },
    [FishQuality.golden]: {
        name: "golden",
        display: "金",
        weight: 5,
        price: 0.15,
        lengthRange: [125, 800],
        fishes: [
            { name: "林北鱼商" },
            { name: "甲鱼大补" },
            { name: "医美变美鱼", prompt: "* 这条鱼做了医美，现在看起来金光闪闪！" },
            { name: "四川话林北鱼" },
            { name: "可爱小杂鱼~♡", prompt: "* 小杂鱼~♡ zako zako~ 是金色的小杂鱼！" },
            { name: "emo痛苦鲑鱼" },
            { name: "传说钓鱼竿", prompt: "* 你用鱼竿钓到了鱼竿？这是什么操作！" },
            { name: "大闸蟹" },
            { name: "蒲烧鳗鱼" },
            { name: "佩佩蛙" },
            { name: "豹猫鱼" },
            { name: "果冻水母" },
            { name: "波士顿龙虾" },
            { name: "深海鲭鱼" },
            { name: "毒河豚料理" },
            { name: "钻石岩鱼" },
            { name: "深海乌贼" },
            { name: "凡尔赛鱼", prompt: "* 这条鱼在凡尔赛：我只是随便游游就被钓上来了..." },
            { name: "派大星" },
            { name: "空心粉鱼" },
            { name: "本格蓝鳍金枪鱼" },
            { name: "finale压轴鱼" },
            { name: "纯金金条鱼", prompt: "* 这条鱼全身都是金条，发财了！" },
            { name: "锦鲤", prompt: "* 这条鱼是传说中的锦鲤，能带来好运~" },
            { name: "超频显卡水母", prompt: "* 580 显卡水母，性能强劲！" },
            { name: "网红带货鱼", prompt: "* 不要648，不要48，钓到就能回家！" },
            { name: "金闪闪土豪鱼", prompt: "* 这条鱼身上闪烁着金光~" },
            { name: "区块链NFT鱼", prompt: "* 这条鱼要价一个以太坊，但现在免费送给你！" },
            { name: "理财产品鱼" },
            { name: "五一黄金周特产鱼" }
        ]
    },
    [FishQuality.void]: {
        name: "void",
        display: "虚空",
        weight: 3,
        price: 0.2,
        lengthRange: [800, 4000],
        fishes: [
            { name: "珊瑚宫心海", prompt: "* 璃月港的军师，不对，是稻妻的现人神巫女！" },
            { name: "应急食品派蒙", prompt: "* 派蒙不是应急食品！...但现在变成鱼了。" },
            { name: "椰羊甘雨", prompt: "* 半仙之体的椰羊，咩咩咩~" },
            { name: "纯水精灵BOSS" },
            { name: "隐身透明鱼", prompt: "* 你确定你钓到了什么吗？反正你看不见..." },
            { name: "深渊乌贼" },
            { name: "传说鳗鱼" },
            { name: "激光炮鱼", prompt: "* piu piu piu！这条鱼发射激光了！" },
            { name: "三文鱼皇帝" },
            { name: "深海夜明珠" },
            { name: "纯粹的「鱼」", prompt: "* 这就是鱼的本质，纯粹的「鱼」！" },
            { name: "Patrick海星" },
            { name: "幽灵闪灵" },
            { name: "佛系咸鱼", prompt: "* 这条咸鱼已经得道成仙，淡看一切..." },
            { name: "赛博朋克鲨鱼", prompt: "* 2077年的鲨鱼，体内植入了芯片！" },
            { name: "反物质湮灭鱼", prompt: "* 危险！这条鱼接触到物质会发生湮灭！" },
            { name: "薛定谔的量子水母", prompt: "* 这条水母既存在又不存在，直到你观测它..." },
            { name: "崩坏3rd鱼" },
            { name: "创世原初鲑鱼", prompt: "* 传说中创造世界的第一条鲑鱼！" },
            { name: "异次元鱼", prompt: "* 这条鱼来自其他维度，带着异世界的秘密..." },
            { name: "社恐珍珠" },
            { name: "迷失虚空鱼" }
        ]
    },
    [FishQuality.hidden_fire]: {
        name: "hidden_fire",
        display: "隐火",
        weight: 1,
        price: 0.2,
        lengthRange: [1000, 4000],
        fishes: [
            { name: "黄河之水天上来", prompt: "* 君不见黄河之水天上来，奔流到海不复回！" },
            { name: "MrlingXD" },
            { name: "闪耀珍珠", prompt: "* 这颗珍珠闪耀着内心的火焰！" },
            { name: "岩浆水母", prompt: "* 来自火山深处的水母，触手燃烧着岩浆！" },
            { name: "地狱火龙虾", prompt: "* 地狱来的龙虾，钳子里燃烧着业火！" },
            { name: "炸弹河豚", prompt: "* 小心！这条河豚随时可能爆炸！" },
            { name: "熔岩岩鱼" },
            { name: "凤凰涅槃鲑鱼", prompt: "* 浴火重生的鲑鱼，带着不死鸟的力量！" },
            { name: "火山口特产鱼" },
            { name: "核爆珍珠", prompt: "* 这颗珍珠蕴含着核聚变的力量！危险等级：SSS+" },
            { name: "破次元壁鱼", prompt: "* 这条鱼打破了次元壁，从二次元游到了现实！" },
            { name: "烈火燃烧水母" },
            { name: "炼狱龙虾" },
            { name: "逆天改命转运鱼", prompt: "* 这条鱼能够逆天改命，改变你的命运！" },
            { name: "红莲业火鲑鱼" },
            { name: "燃尽之魂鱼", prompt: "* 这条鱼燃烧着不屈的灵魂！" },
            { name: "内心火焰鱼", prompt: "* 点燃你内心的火焰，永不熄灭！" }
        ]
    }
};
