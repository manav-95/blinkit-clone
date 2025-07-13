import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadProductImages = upload.fields([
    {name: 'mainImage', maxCount: 1},
    {name: 'galleryImages'},
])