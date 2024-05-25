import mongoose, { Schema } from "mongoose";
const subcriptionSchemas = new mongoose.Schema(
    {
        subcriber: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

export const Subcription = new mongoose.model(
    "Subcription",
    subcriptionSchemas
);
