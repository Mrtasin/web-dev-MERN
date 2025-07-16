import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUploder = async (filePath) => {
  try {
    if (!filePath) return null;

    const response = await cloudinary.uploader.upload(filePath, {
      public_id: "avatars",
      resource_type: "auto",
    });

    console.log(`Response :- ${response}`);
    return response;
  } catch (error) {
    console.error("Error for uploding on cloudinary :- ", error);
    return null;
  }
};

export default fileUploder;
