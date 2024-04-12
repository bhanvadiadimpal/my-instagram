import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";


const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, },
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    try {
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(400).json({ message: 'Error uploading file' });
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            res.status(200).json({ url: fileUrl });
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}