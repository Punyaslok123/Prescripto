import {v2 as cloudinary} from 'cloudinary'
// This imports version 2 of the Cloudinary Node.js SDK.

// Here we define an asynchronous function named connectCloudinary.Even though this function doesn’t await anything right now, marking it as async is a good habit — it gives flexibility to add async operations later

const connectCloudinary= async() => {
  // cloudinary.config() initializes the connection to your Cloudinary account.You pass it an object containing your account credentials:

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
  
}

// Exports the connectCloudinary function as the default export.
export default connectCloudinary