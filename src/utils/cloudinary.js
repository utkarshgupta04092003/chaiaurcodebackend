import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath, folderName) => {
    try {
        if (!localFilePath) return null;

        // upload the files
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folderName
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (err) {
        // remove the file from local saved temp file as the upload fails
        fs.unlinkSync(localFilePath);
        throw err;
    }
};
export {uploadOnCloudinary};
