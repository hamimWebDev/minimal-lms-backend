import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    port: process.env.PORT,
    database_url: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
    node_env:process.env.NODE_ENV,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    // cloudinary_folder: process.env.CLOUDINARY_FOLDER,
};

