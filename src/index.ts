import { Context, h } from "koishi";
import {} from "koishi-plugin-rate-limit";
import { Config } from "./config";
import { applyModel } from "./model";
import {} from "koishi-plugin-adapter-onebot";
import {} from "@u1bot/koishi-plugin-coin";
import { choice, get_backpack, get_fish_price, get_fishing_stats, get_quality_display, save_fish } from "./data_source";
export { Config } from "./config";
export const name = "fishing";
export const inject = {
    required: ["database", "coin"],
    optional: ["fortune"]
};

export async function apply(ctx: Context, config: Config) {
    applyModel(ctx);
    ctx.command("fishing", "就是钓鱼", { minInterval: config.fishing_cooldown * 1000 })
        .channelFields(["fishing_switch"])
        .alias("钓鱼")
        .action(async ({ session }) => {
            (async () => {
                if (!session || !session.messageId) {
                    throw new Error("无法获取会话信息");
                }
                if (session.channel && session.channel.fishing_switch === false) {
                    return "此群钓鱼功能已被禁用，请联系管理员开启";
                }
                await session.send(h.quote(session.messageId) + "甩杆ing...");
                const fish = await choice(ctx, session, config);
                const waitTime = Math.floor(Math.random() * 6 + 1) * 1000;
                await new Promise((resolve) => setTimeout(resolve, waitTime));
                let result = `* 你钓到了一条 [${get_quality_display(fish.fish.quality, config)}]${
                    fish.fish.name
                }，长度为 ${fish.fish.length}cm！`;
                if (fish.fish.name == "河") {
                    result = "* 河累了，休息..等等...你钓到了一条河？！";
                } else if (fish.fish.name == "尚方宝剑") {
                    result = `* 你钓到了一把 [${get_quality_display(fish.fish.quality, config)}]${
                        fish.fish.name
                    }，长度为 ${fish.fish.length}cm！`;
                } else if (fish.fish.name == "MrlingXD") {
                    result = `* 你钓到了一条...呃我没看错吧？！这是 MrlingXD 吗？`;
                }
                await save_fish(ctx, session, fish.fish);
                await session.send(h.quote(session.messageId) + result);
            })();
            return;
        });

    ctx.command("背包", "查看背包中的鱼").action(async ({ session }) => {
        if (!session || !session.userId) {
            throw new Error("无法获取用户信息");
        }
        const backpack = await get_backpack(ctx, session.userId);
        if (Object.keys(backpack).length === 0) {
            return h.quote(session.messageId) + "* 你的背包装满了空气";
        }
        const msgList: string[] = [];
        msgList.push("你的背包中有以下鱼：\n");
        for (const [quality, fishes] of Object.entries(backpack)) {
            if (fishes.length === 0) {
                continue;
            }
            const qualityDisplay = `${get_quality_display(quality, config)}：\n${fishes.join("\n")}\n`;
            msgList.push(qualityDisplay);
        }
        if (session.onebot) {
            const nodeList = msgList.map((text) => ({
                type: "node",
                data: {
                    user_id: session.bot?.userId,
                    content: text
                }
            }));
            if (session.onebot && session.onebot.group_id) {
                await session.onebot.sendGroupForwardMsg(session.onebot.group_id, nodeList);
                return;
            } else if (session.onebot && session.onebot.user_id) {
                await session.onebot.sendPrivateForwardMsg(session.onebot.user_id, nodeList);
                return;
            }
        }
        return msgList.join("\n\n");
    });
    ctx.command("统计信息", "查看钓鱼统计信息").action(async ({ session }) => {
        if (!session || !session.userId) {
            throw new Error("无法获取用户信息");
        }
        const stats = await get_fishing_stats(ctx, session.userId);
        return `你的钓鱼统计信息：
- 总钓鱼次数：${stats.frequency}
- 背包中的鱼总长：${stats.fishes.reduce((sum, fish) => sum + fish.length, 0)}cm
        `;
    });
    ctx.command("钓鱼开关", "查看或设置钓鱼开关")
        .channelFields(["fishing_switch"])
        .action(async ({ session }) => {
            if (!session || !session.userId) {
                throw new Error("无法获取用户信息");
            }
            if (!session.guildId || !session.channel) {
                return h.quote(session.messageId) + "怎么啦，你要控制自己不要钓鱼嘛";
            }
            if (!session.onebot) {
                return h.quote(session.messageId) + "暂不支持非 OneBot 适配器的钓鱼开关";
            }
            if (session.onebot?.sender.role !== "admin" && session.onebot?.sender.role !== "owner") {
                return h.quote(session.messageId) + "你没有权限设置钓鱼开关";
            }
            session.channel.fishing_switch = !session.channel.fishing_switch;
            return h.quote(session.messageId) + `钓鱼开关已${session.channel.fishing_switch ? "打开" : "关闭"}`;
        });
    ctx.command("卖鱼 <name>", "卖掉一条鱼").action(async ({ session }, name: string) => {
        if (!session || !session.userId) {
            throw new Error("无法获取用户信息");
        }
        if (!name) {
            return h.quote(session.messageId) + "请输入要卖掉的鱼的名称";
        }
        const record = await ctx.database.get("fishing_record", { user_id: session.userId });
        if (record.length === 0) {
            return h.quote(session.messageId) + "没鱼还想卖鱼？！";
        }
        const { fishes } = record[0];
        const fishIndex = fishes.findIndex((fish) => fish.name === name);
        if (fishIndex === -1) {
            return h.quote(session.messageId) + `你没有名为 "${name}" 的鱼`;
        }
        const fish = fishes[fishIndex];
        const price = get_fish_price(fish, config);
        fishes.splice(fishIndex, 1);
        await ctx.database.set("fishing_record", { user_id: session.userId }, { fishes });
        await ctx.coin.adjustCoin(session.userId, price, "卖鱼");
        return (
            h.quote(session.messageId) +
            `* 你卖掉了一条 ${get_quality_display(fish.quality, config)} ${fish.name}，长度为 ${
                fish.length
            }cm，获得了 ${price.toFixed(2)} 次元币`
        );
    });
}
1;
