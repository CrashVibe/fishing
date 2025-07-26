import { Context, h } from "koishi";
import {} from "koishi-plugin-rate-limit";
import { Config } from "./config";
import { applyModel } from "./model";
import {} from "koishi-plugin-adapter-onebot";

import { choice, get_backpack, get_fishing_stats, get_quality_display, save_fish } from "./data_source";
export { Config } from "./config";
export const name = "fishing";
export const inject = {
    required: ["database"],
    optional: ["fortune"]
};

export async function apply(ctx: Context, config: Config) {
    applyModel(ctx);
    ctx.command("fishing", "就是钓鱼", { minInterval: config.fishing_cooldown * 1000 })
        .channelFields(["fishing_switch"])
        .alias("钓鱼")
        .action(async ({ session }) => {
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
            let result = `* 你钓到了一条 ${get_quality_display(fish.fish.quality, config)} ${fish.fish.name}，长度为 ${
                fish.fish.length
            }cm！`;
            if (fish.fish.name == "河") {
                result = "* 河累了，休息..等等...你钓到了一条河？！";
            } else if (fish.fish.name == "尚方宝剑") {
                result = `* 你钓到了一把 ${get_quality_display(fish.fish.quality, config)} ${fish.fish.name}，长度为 ${
                    fish.fish.length
                }cm！`;
            } else if (fish.fish.name == "MrlingXD") {
                result = `* 你钓到了一条...呃我没看错吧？！这是 MrlingXD 吗？`;
            }
            await save_fish(ctx, session, fish.fish);
            return h.quote(session.messageId) + result;
        });

    ctx.command("背包", "查看背包中的鱼").action(async ({ session }) => {
        if (!session || !session.userId) {
            throw new Error("无法获取用户信息");
        }
        const backpack = await get_backpack(ctx, session.userId);
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
                return "怎么啦，你要控制自己不要钓鱼嘛";
            }
            if (!session.onebot) {
                return "暂不支持非 OneBot 适配器的钓鱼开关";
            }
            if (session.onebot?.sender.role !== "admin" && session.onebot?.sender.role !== "owner") {
                return "你没有权限设置钓鱼开关";
            }
            session.channel.fishing_switch = !session.channel.fishing_switch;
            return `钓鱼开关已${session.channel.fishing_switch ? "打开" : "关闭"}`;
        });
}
