import { Context } from "koishi";
import { Fish } from "./config";

declare module "koishi" {
    interface Tables {
        fishing_record: FishingRecordModel;
    }
    interface Channel {
        fishing_switch: boolean;
    }
}

export interface FishingRecordModel {
    user_id: string;
    frequency: number;
    fishes: Fish[];
}

export async function applyModel(ctx: Context) {
    ctx.model.extend("channel", {
        fishing_switch: {
            type: "boolean",
            initial: true
        }
    });
    ctx.model.extend(
        "fishing_record",
        {
            user_id: "string",
            frequency: "unsigned",
            fishes: "json"
        },
        {
            primary: "user_id"
        }
    );
}
