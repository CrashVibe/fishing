import { Context, Session } from "koishi";
import { Config, Quality, FishQuality, Fish } from "./config";
import {} from "@u1bot/koishi-plugin-fortune/src";

export async function choice(ctx: Context, session: Session, config: Config) {
    if (!session.userId) {
        throw new Error("无法获取用户ID");
    }

    const { weight, adjustment_mode, luck_star_num } = await get_weight(ctx, config, session.userId);

    // 加权随机选择鱼品质
    const fish_quality = weighted_choice(Object.values(FishQuality), Object.values(weight));

    // 获取该品质对应的配置
    const quality_map = map_quality_to_config([
        config.rotten,
        config.moldy,
        config.common,
        config.golden,
        config.void,
        config.hidden_fire
    ]);

    const selected_fish_config = quality_map[fish_quality];
    const fish_name = random_choice(selected_fish_config.fish);
    const random_length = random_int_range(
        // trust me 大法
        selected_fish_config.long[0] as number,
        selected_fish_config.long[1] as number
    );

    return {
        fish: {
            name: fish_name,
            quality: fish_quality,
            length: random_length,
            price: selected_fish_config.price
        } as Fish,
        adjustment_mode,
        luck_star_num
    };
}

/**
 * 根据权重进行随机选择
 */
function weighted_choice<T>(items: T[], weights: number[]): T {
    const total_weight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * total_weight;
    for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) {
            return items[i];
        }
        random -= weights[i];
    }
    return items[items.length - 1]; // fallback
}

/**
 * 随机从数组中选一个元素
 */
function random_choice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 包含上下限的整数随机数生成器
 */
function random_int_range(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 计算幸运星数量对权重的影响 (指数函数)
 * @param config 配置
 * @param luck_star_num 星数量
 * @returns 权重增加值
 */
function calculate_weight_increase(config: Config, luck_star_num: number): number {
    const base = config.base_weight_increase;
    return base * (Math.pow(1.1, luck_star_num) - 1);
}

/**
 * 将鱼的数组映射到对应的品质配置
 *
 * @param fishes 鱼的数组
 * @returns 映射后的权重对象
 */
function map_quality_to_config(fishes: Quality[]): Record<FishQuality, Quality> {
    return {
        [FishQuality.rotten]: fishes[0],
        [FishQuality.moldy]: fishes[1],
        [FishQuality.common]: fishes[2],
        [FishQuality.golden]: fishes[3],
        [FishQuality.void]: fishes[4],
        [FishQuality.hidden_fire]: fishes[5]
    };
}

/**
 * 根据用户运势调整鱼权重，返回对应权重值
 *
 * @param ctx 上下文
 * @param config 配置
 * @param userId 用户ID
 * @returns
 * - `weight`: 表示每种鱼的权重
 * - `adjustment_mode`: 标记是否有被幸运星调整/影响
 * - `luck_star_num`: 数字或null，表示幸运星数量（如果有的话）
 */
async function get_weight(ctx: Context, config: Config, userId: string) {
    let luck_star_num: number | null = null;
    if (ctx.fortune) {
        luck_star_num = await ctx.fortune.get_user_luck_star(userId);
    }

    const qualities = Object.values(FishQuality);
    const quality_configs = [
        config.rotten,
        config.moldy,
        config.common,
        config.golden,
        config.void,
        config.hidden_fire
    ];
    const quality_map = map_quality_to_config(quality_configs);

    const adjusted_qualities = new Set([FishQuality.golden, FishQuality.hidden_fire, FishQuality.void]);
    let adjustment_mode = false;

    const weight: Record<FishQuality, number> = {} as Record<FishQuality, number>;

    for (const quality of qualities) {
        const original_weight = quality_map[quality].weight;

        if (luck_star_num !== null && adjusted_qualities.has(quality)) {
            const increase = calculate_weight_increase(config, luck_star_num);
            const new_weight = Math.min(original_weight + increase, config.max_weight);
            weight[quality] = new_weight;
            adjustment_mode = true;
        } else {
            weight[quality] = original_weight;
        }
    }

    return { weight, adjustment_mode, luck_star_num };
}

export async function save_fish(ctx: Context, session: Session, fish: Fish) {
    const { userId } = session;
    let record = await ctx.database.get("fishing_record", { user_id: userId });

    if (record.length === 0) {
        record = [
            await ctx.database.create("fishing_record", {
                user_id: userId,
                frequency: 1,
                fishes: [fish]
            })
        ];
    } else {
        const fish_record = record[0].fishes;
        const existing = fish_record.find((f) => f.quality === fish.quality && f.name === fish.name);
        if (existing) {
            existing.length += fish.length;
        } else {
            fish_record.push(fish);
        }
        await ctx.database.set(
            "fishing_record",
            { user_id: userId },
            {
                frequency: record[0].frequency + 1,
                fishes: fish_record
            }
        );
    }
}

export function get_quality_display(quality: string, config: Config): string {
    switch (quality) {
        case "rotten":
            return config.rotten.display;
        case "moldy":
            return config.moldy.display;
        case "common":
            return config.common.display;
        case "golden":
            return config.golden.display;
        case "void":
            return config.void.display;
        case "hidden_fire":
            return config.hidden_fire.display;
        default:
            return quality;
    }
}

export async function get_backpack(ctx: Context, userId: string) {
    // 按照鱼的品质分组
    const record = await ctx.database.get("fishing_record", { user_id: userId });
    if (record.length === 0) {
        return {
            rotten: [],
            moldy: [],
            common: [],
            golden: [],
            void: [],
            hidden_fire: []
        };
    }
    const {fishes} = record[0];
    const grouped: Record<FishQuality, Fish[]> = {
        rotten: [],
        moldy: [],
        common: [],
        golden: [],
        void: [],
        hidden_fire: []
    };
    for (const fish of fishes) {
        grouped[fish.quality].push(fish);
    }
    const formatted: Record<FishQuality, string[]> = {
        rotten: grouped.rotten.map((f) => `${f.name} (${f.length}cm)`),
        moldy: grouped.moldy.map((f) => `${f.name} (${f.length}cm)`),
        common: grouped.common.map((f) => `${f.name} (${f.length}cm)`),
        golden: grouped.golden.map((f) => `${f.name} (${f.length}cm)`),
        void: grouped.void.map((f) => `${f.name} (${f.length}cm)`),
        hidden_fire: grouped.hidden_fire.map((f) => `${f.name} (${f.length}cm)`)
    };

    return formatted;
}

export async function get_fishing_stats(ctx: Context, userId: string) {
    const record = await ctx.database.get("fishing_record", { user_id: userId });
    if (record.length === 0) {
        return {
            frequency: 0,
            fishes: []
        };
    }
    return {
        frequency: record[0].frequency,
        fishes: record[0].fishes
    };
}