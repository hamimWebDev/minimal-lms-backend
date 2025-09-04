import { model, Schema, Query } from "mongoose";
import { IUser } from "./user.interface";
import * as bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,

    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user", "superAdmin"],
        default: "user",
    },
    status: {
        type: String,
        required: true,
        enum: ["in-progress", "blocked"],
        default: "in-progress",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
});


// 👇 This automatically filters out isDeleted: true from all find queries
userSchema.pre<Query<any, any>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});


// password hash
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}



export const User = model<IUser>("User", userSchema);
