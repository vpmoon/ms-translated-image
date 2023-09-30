require('dotenv').config();
const { getTranslatedImage } = require('./service');
const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config()
const upload = multer({ storage: multer.memoryStorage() });

// Define a basic route
app.post('/translation/image', upload.single('file'), async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const uploadedFile = req.file;

    const buffer = await getTranslatedImage(uploadedFile.buffer);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(buffer);
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});