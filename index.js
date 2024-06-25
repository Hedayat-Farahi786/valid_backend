const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { createCanvas, loadImage, registerFont } = require('canvas');
const admin = require('firebase-admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

app.use(cors())

// const allowedOrigins = ["https://navidbelly.vercel.app", "*"];
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   }
// }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a sample MongoDB model
const SampleModel = mongoose.model(
  "Valid",
  new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    imagePath: { type: String, required: true },
  })
);


const serviceAccount = {
  "type": "service_account",
  "project_id": "navid-963cf",
  "private_key_id": "81581b9828237788bd13d262fb2cd4c129364952",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2cCYKhtSFyFiC\nNhL4AZ+Z4Te4102XQDsnWFN4VkCT5IHX5kLVIRe8RxMTs/XYK6fpOyNtx24cogV4\nqz/DuGv3/RogWumHRNd+8zsiMsA1WYJ92h4IH0eyhk9/QWVWXgoRRV4zh4gKpuSC\ndt3PQWm5tkp635Pz5bPs+jZ5jseu6bA2Z5/VliECNAi33LKN4dWTjt78bIOG8vaD\ndZ5xC4R0/FRKXTlCHGv36JG/xfMy73Y7mzFLhitsH8EeUInp6tslD2tsC1ir8CZZ\nReLjDCS2jQithxJx260byHt8ynuSg36zF+ZB4cI2jK/3YG+d85/Vr7G7zz3kh+xW\nviHuvBq5AgMBAAECggEAAPy4Hfo3C+7GuNSnU1954DypXycOGM2MjGTUVcw8rvgv\nci5BKhNS5C5LxoFkqQnqb48F/O31dPL0/d9KWeolbmr4kViAlz5qfpm9Fg0pgFhm\nxfzQSQm3SvpiU31UeaxKWGfUT8nR1QHsbl7LijevxWUcv8+2Jp2VdMixUwTQZIxF\nk0qEN97wvBPUmwkdvoQB+wH23gBbb7MhehHnpg0rgq1O5jrJH06Z8KYcYqzJFgzz\nZZ2WM+4nq2xkTutkOBv3G3ReMGD3+o94jchgrWejYhcE4jbo/uuopJzT91lNDJMR\n+foTRbnv4CUhUsNE5JMUB2N04FIl1DeqXWLxE4UOkQKBgQDniFghsmTQr0vGdmO/\nB5hGjGcHzmD4ZliDCP96m3QIPLK3BZQMgP0vJlLDzzhdtwAObrT0yv+qTgIh5gD+\n/G6YRCvzPMDYzN4A/chEQS4/7m+7AAxYqqUnP57ZXWorruWNayWF0WfhxsIEb2pP\nC21bLlx9VMSjByjBXIM5sMyAKQKBgQDJt6ZFR5+vx+WCgqSxvMnglx9EqTxn/AJd\nrUJ1FBNsz0sX31EtaMzDiohVoQWXC9XQ98X4/jyeemIIwINrKf2vISeVmqYC9qiq\n538XnZQNlZADPqNFOZxxobXkxQmUG3osFL7aOI8ZUQRak4kCdMR03R3GNE+1OIOn\nd0GzqX3YEQKBgGJeZzNJ29Nd5s/XFOHglC3FETEb2c8vjIN/myu4SEAHqdZgpFn7\no5YYrilLLSOD0J5RIsiuRplQs087rUiob0R6EkIxma2CvP+m0yNMnh3Da+0DRDuX\npLtcKF0pdyZAFH9U+og0Q/KEw4Gm5H/Y1wlaVSlajoDFVedxKr+kAf6hAoGASnbK\nIW8USu6vEeOqapZ3q7n95/nVe8lzEiPAkbnMhfFsFi7xJ6M1W8YLGBkuGBldYBvn\ncEhiFlq1T+fJW8kPhhPmKfsB57wofZahuxUHr5ATrq7z1L00vFnm7MG0DIGsMxOh\ndKtGYCEhS1KFVGvIjh+GO0HaXtqy9yI2Fd2uwBECgYEAz1FlzCE2iMtfpoNB24lV\nTHZ5ZfQJTySdUN4dDHDtbKsDSDVKu8qMCPjqQeL9MbtDTacZc8DmwfUVIBfHXE6S\nR/LQh9URFljaQ7nsQlXAGqWcwriruvwk9hzdcp6r5Gsn5o6Grl61L44lF2/UHywN\nBmLgQgsXzL1vuDp6t+ROwZE=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-4wo06@navid-963cf.iam.gserviceaccount.com",
  "client_id": "110934923516339671992",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4wo06%40navid-963cf.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://navid-963cf.appspot.com'
});

const storage = admin.storage().bucket();

registerFont(path.join(__dirname, "/NotoSansArabic-Bold.ttf"), { family: 'ArabicFont' });
registerFont(path.join(__dirname, "/GlacialIndifference-Bold.otf"), { family: 'EnglishFont' });

// Example route
app.get("/", async (req, res) => {
  res.send("Hello! 2 :)");
});


// Route to fetch guests list
app.get("/guests_list", async (req, res) => {
    try {
      // Query the database to retrieve all records
      const allSamples = await SampleModel.find();
  
      // Send the array of records as the response
      res.json(allSamples);
    } catch (error) {
      console.error("Error fetching samples:", error);
      res.status(500).send({ status: "nok", message: error.message });
    }
  });

// Route to fill image
app.post("/fill-image", async (req, res) => {
    try {
        const { name, number, twoNames } = req.body;

        // Load the template image
        const template = await loadImage(path.join(__dirname, "/template.jpg"));

        // Create a canvas
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext('2d');

        // Draw the template image onto the canvas
        ctx.drawImage(template, 0, 0, template.width, template.height);

        let englishText = false; // Default to false
        const languageRegex = /^[a-zA-Z\säöüÄÖÜßàáâãäåçèéêëìíîïðñòóôõöøùúûüýÿÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ\s]+$/;
        
        // Check if the text is in English
        if (languageRegex.test(name)) {
          englishText = true;
        }

        // Set font properties for Arabic text
        ctx.font = englishText ? '32px EnglishFont' : '32px ArabicFont'; // Use the custom font here
        ctx.fillStyle = '#394017'; // Set your desired color here
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // Ensure text is vertically centered

        // Draw Arabic name on the image
        ctx.fillText(name, canvas.width / 2, (canvas.height / 2) - (twoNames ? 180 : 150));

        const editedImageBuffer = canvas.toBuffer();
        

        const fileName = `valid/${new Date().getTime()}_edited-image.jpg`;
        const file = storage.file(fileName);

        await file.save(editedImageBuffer, {
          metadata: {
            contentType: 'image/jpeg' // Adjust according to your image type
          }
        });

        const expiresAt = new Date('2025-04-30'); // Expiry date
        // Generate a signed download URL for the image
        const imageUrl = await file.getSignedUrl({
            action: 'read',
            expires: expiresAt.toISOString() // Set expiry date/time as needed
          });

        // Create a new document in the database to store the image URL
        const newSample = new SampleModel({
            name: name,
            number: number,
            imagePath: imageUrl[0], // Use the Firebase Storage URL
        });

        const savedRecord = await newSample.save();

        // Send success response with the image URL from Firebase Storage
        res.json({ card: savedRecord });


    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Route to delete a sample by ID
app.delete("/guests_list/:id", async (req, res) => {
    const sampleId = req.params.id;
  
    try {
      // Find the record by ID and delete it
      const deletedSample = await SampleModel.findByIdAndDelete(sampleId);
  
      // If the record is not found, return 404
      if (!deletedSample) {
        return res
          .status(404)
          .json({ status: "not found", message: "Record not found" });
      }
  
      // Send a success response
      res.json({
        status: "success",
        message: "Record deleted successfully",
        deletedSample,
      });
    } catch (error) {
      console.error("Error deleting sample:", error);
      res.status(500).send({ status: "nok", message: error.message });
    }
  });
  


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});