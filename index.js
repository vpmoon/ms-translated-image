const fs = require('fs');
const vision = require('@google-cloud/vision');
const { Translate } = require('@google-cloud/translate').v2;

// Initialize Google Cloud Vision client with your API credentials
var sizeOf = require('image-size');
const { createCanvas, loadImage } = require('canvas');

require('dotenv').config()

const imageFilePath = '/Users/vpetrenko/Documents/hackathon/2023-09-30 17.21.55.jpg';
const targetLanguage = 'en';

const translateClient = new Translate();

// Function to extract text from an image
async function extractTextFromImage(imageFilePath) {
    const imageContent = fs.readFileSync(imageFilePath);
    const client = new vision.ImageAnnotatorClient();

    const resp = await client.textDetection(imageContent);

    return resp[0].textAnnotations;
}

// Translate the extracted text to your desired language
async function translateText(text, targetLanguage) {
    const [translation] = await translateClient.translate(text, targetLanguage);
    return translation;
}

// Function to overlay text on an image
async function overlayTextOnImage(dimensions, imageFilePath, texts) {

    // Overlay the text on the image
    const canvas = new createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext('2d');

    // Load the original image
    const originalImage = await loadImage(imageFilePath);
    // Draw the original image on the canvas
    ctx.drawImage(originalImage, 0, 0);

    await Promise.all(texts.map(async (textToOverlay) => {
        const vertices = textToOverlay.boundingPoly.vertices;

        const text = textToOverlay.description;

        // Calculate text position (centered within the detected text region)
        console.log(vertices);

        const x = vertices[0].x;
        const y = vertices[3].y;

        const translatedText = await translateText(text, targetLanguage);
        console.log(translatedText);

        // Set text properties
        ctx.font = '10px Arial'; // Adjust font settings as needed
        ctx.fillStyle = 'black'; // Text color
        const textMetrics = ctx.measureText(translatedText);

        // Define background properties
        const backgroundColor = 'white'; // Adjust the background color

        // Calculate background size
        const padding = 4
        const backgroundWidth = textMetrics.width;
        const backgroundHeight = 10 + padding;

        // Draw the background rectangle
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(vertices[0].x, vertices[0].y, backgroundWidth, backgroundHeight);

        // Reset text color
        ctx.fillStyle = 'black';

        // Draw the translated text on the canvas
        ctx.fillText(translatedText, x, y); // Adjust text position
    }));

    // Save the modified image
    const outputImageStream = fs.createWriteStream('output_image.jpg'); // Replace with your output image file
    const stream = canvas.createJPEGStream();
    stream.pipe(outputImageStream);
}

async function main() {
    sizeOf(imageFilePath, async function (err, dimensions) {
        const [all, ...rest] = await extractTextFromImage(imageFilePath); // Replace with your translated text

        await overlayTextOnImage(dimensions, imageFilePath, rest);
    });

}

main().catch(console.error);