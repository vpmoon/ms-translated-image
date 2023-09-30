const fs = require('fs');
const {getTranslatedImage} = require('./service');

require('dotenv').config()
const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config()
const upload = multer({ storage: multer.memoryStorage() });
const imageFilePath = '/Users/vpetrenko/Documents/hackathon/2023-09-30 17.21.55.jpg';

// Define a basic route
app.post('/translation/image', upload.single('file'), async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const uploadedFile = req.file;

    const imageContent = fs.readFileSync(imageFilePath);
    const buffer = await getTranslatedImage(imageContent);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(buffer);
});

app.get('/translation/image', async (req, res) => {
    const imageContent = fs.readFileSync(imageFilePath);
    const buffer = await getTranslatedImage(imageContent);

    res.setHeader('Content-Type', 'image/jpeg');
    res.write(buffer);

    res.end();
});

// const upload = multer({ storage: multer.memoryStorage() });

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});