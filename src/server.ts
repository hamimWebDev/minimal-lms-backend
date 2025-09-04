import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
const port = config.port;


async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        console.log("Database connected successfully");
        app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });
    } catch (error) {
        console.log("Database connection error", error);
    }
}

main();

