"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminUserId = exports.Counter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 },
});
exports.Counter = mongoose_1.default.model('Counter', counterSchema);
const generateAdminUserId = async () => {
    const counter = await exports.Counter.findOneAndUpdate({ name: 'admin' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    const newId = `A-${counter.value.toString().padStart(4, '0')}`;
    return newId;
};
exports.generateAdminUserId = generateAdminUserId;
