import express from 'express'
import cloudinary from '../utils/cloudinary.js'

const router = express.Router();

router.get('/signature', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = cloudinary.config().upload_folder;

  // 💡 Include folder in the params
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    cloudinary.config().api_secret
  );

  res.json({
    timestamp,
    signature,
    apiKey: cloudinary.config().api_key,
    cloudName: cloudinary.config().cloud_name,
    folder,
  });
});


export default router;