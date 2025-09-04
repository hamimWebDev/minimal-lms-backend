"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const port = config_1.default.port;
async function main() {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log("Database connected successfully");
        app_1.default.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });
    }
    catch (error) {
        console.log("Database connection error", error);
    }
}
main();
