import { Schema } from "koishi";
export enum FishQuality {
    rotten = "rotten",
    moldy = "moldy",
    common = "common",
    golden = "golden",
    void = "void",
    hidden_fire = "hidden_fire"
}

export interface Quality {
    name: string;
    display: string;
    weight: number;
    price: number;
    long: [number?, number?, ...any[]];
    fish: string[];
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
    rotten: Quality;
    moldy: Quality;
    common: Quality;
    golden: Quality;
    void: Quality;
    hidden_fire: Quality;
}

export const Config: Schema<Config> = Schema.object({
    base_weight_increase: Schema.number().default(1.9).description("基础权重增加值 (指数函数)"),
    max_weight: Schema.number().default(1000).description("最大权重，超过此值将被限制"),
    fishing_cooldown: Schema.number().default(15).description("钓鱼冷却时间，单位秒"),
    rotten: Schema.object({
        name: Schema.string().default("rotten"),
        display: Schema.string().default("腐烂").description("腐烂品质名称"),
        weight: Schema.number().default(20).description("权重，越大越容易钓到"),
        price: Schema.number().default(0.05).description("钓到腐烂的价格"),
        long: Schema.tuple([Number, Number]).default([15, 45]).description("钓到腐烂的长度范围"),
        fish: Schema.array(Schema.string()).default([
            "喝醉的鱼",
            "摆烂的鱼",
            "螃蟹",
            "乌贼",
            "龙虾",
            "海星",
            "空心鱼",
            "触手",
            "海参",
            "孙笑川鱼",
            "熬夜的鱼",
            "过期罐头鱼",
            "丧气鱼",
            "emo鱼",
            "电量不足鱼",
            "烂掉的河豚",
            "干瘪的水母",
            "社畜鱼",
            "喝西北风鱼",
            "社死鱼",
            "星期一的鱼"
        ])
    }),
    moldy: Schema.object({
        name: Schema.string().default("moldy"),
        display: Schema.string().default("发霉").description("霉鱼品质名称"),
        weight: Schema.number().default(15).description("权重，越大越容易钓到"),
        price: Schema.number().default(0.08).description("钓到霉的价格"),
        long: Schema.tuple([Number, Number]).default([20, 150]).description("钓到霉的长度范围"),
        fish: Schema.array(Schema.string()).default([
            "上过大学的鱼",
            "大专学历的鱼",
            "社恐鱼",
            "Code 鱼",
            "Kobe鱼",
            "404 鱼",
            "贴图错误鱼",
            "鲤鱼",
            "鳗鱼",
            "鲭鱼",
            "鲑鱼",
            "内卷鱼",
            "GPT鱼",
            "调不通的接口鱼",
            "bug鱼",
            "逃避现实鱼",
            "独居鱼",
            "考研失败鱼",
            "鸽了的鱼",
            "ICU鱼",
            "眼神死鱼"
        ])
    }),
    common: Schema.object({
        name: Schema.string().default("common"),
        display: Schema.string().default("普通").description("普通鱼品质名称"),
        weight: Schema.number().default(100).description("权重，越大越容易钓到"),
        price: Schema.number().default(0.1).description("钓到普通的价格"),
        long: Schema.tuple([Number, Number]).default([1, 30]).description("钓到普通的长度范围"),
        fish: Schema.array(Schema.string()).default([
            "尚方宝剑",
            "丁真鱼",
            "抑郁鱼",
            "开朗鱼",
            "鲤鱼",
            "水母",
            "虾",
            "鲭鱼",
            "龙虾",
            "鲑鱼",
            "yee鱼",
            "鱿鱼",
            "面筋鱼",
            "武昌鱼",
            "草鱼",
            "青鱼",
            "鳙鱼",
            "海星",
            "鳗鱼",
            "海参",
            "鲷鱼",
            "鲢鱼",
            "多宝鱼",
            "龙利鱼",
            "黄花鱼",
            "墨鱼",
            "中华田园鱼",
            "泡面鱼",
            "沙雕鱼",
            "无语鱼",
            "摸鱼侠",
            "水族馆逃兵",
            "恰烂饭鱼",
            "暴躁虾",
            "碎觉鱼",
            "滴滴鱼"
        ])
    }),
    golden: Schema.object({
        name: Schema.string().default("golden"),
        display: Schema.string().default("金").description("金品质名称"),
        weight: Schema.number().default(5).description("权重，越大越容易钓到"),
        price: Schema.number().default(0.15).description("钓到金的价格"),
        long: Schema.tuple([Number, Number]).default([125, 800]).description("钓到金的长度范围"),
        fish: Schema.array(Schema.string()).default([
            "林北卖的鱼",
            "甲鱼",
            "med肥鱼",
            "林北的四文鱼",
            "小杂鱼~♡",
            "痛苦的鲑鱼",
            "钓鱼竿",
            "鲤鱼",
            "螃蟹",
            "鳗鱼",
            "蛙",
            "豹鱼",
            "水母",
            "龙虾",
            "鲭鱼",
            "河豚",
            "岩鱼",
            "乌贼",
            "海星",
            "空心鱼",
            "蓝鳍金枪鱼",
            "压轴鱼",
            "金条鱼",
            "人生赢家鱼",
            "超频水母",
            "带货鱼",
            "暴富鲤鱼",
            "金闪闪鱼",
            "NFT鱼",
            "理财大师鱼",
            "黄金周鱼"
        ])
    }),
    void: Schema.object({
        name: Schema.string().default("void"),
        display: Schema.string().default("虚空").description("虚空鱼品质名称"),
        weight: Schema.number().default(3).description("权重，越大越容易钓到"),
        price: Schema.number().default(0.2).description("钓到虚空的价格"),
        long: Schema.tuple([Number, Number]).default([800, 4000]).description("钓到虚空的长度范围"),
        fish: Schema.array(Schema.string()).default([
            "心海",
            "派蒙",
            "甘雨",
            "纯水精灵",
            "透明鱼",
            "乌贼",
            "鳗鱼",
            "烤激光鱼",
            "鲑鱼大帝",
            "珍珠",
            "鱼",
            "海星",
            "深海闪灵",
            "内心毫无波澜鱼",
            "赛博鲨",
            "反物质鱼",
            "量子水母",
            "崩坏鱼",
            "原初之鲑",
            "异度之鱼",
            "自闭珍珠",
            "迷失之鱼"
        ])
    }),
    hidden_fire: Schema.object({
        name: Schema.string().default("hidden_fire"),
        display: Schema.string().default("隐火").description("隐火鱼品质名称"),
        weight: Schema.number().default(1).description("权重，越大越容易钓到"),
        price: Schema.number().default(0.2).description("钓到隐火的价格"),
        long: Schema.tuple([Number, Number]).default([1000, 4000]).description("钓到隐火的长度范围"),
        fish: Schema.array(Schema.string()).default([
            "河",
            "MrlingXD",
            "闪耀珍珠",
            "水母",
            "龙虾",
            "河豚",
            "岩鱼",
            "鲑鱼",
            "火山口的鱼",
            "炸裂珍珠",
            "次元突破鱼",
            "燃烧的水母",
            "烈焰龙虾",
            "逆天改命鱼",
            "红莲鲑鱼",
            "灵魂燃尽鱼",
            "心火鱼"
        ])
    })
});
