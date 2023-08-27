require('dotenv').config();
const fs = require('fs');
const path = require('path');
const NodeWebcam = require('node-webcam');
const AWS = require('aws-sdk');

const {
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESSKEY: secretAccessKey,
  S3_BUCKET_REGION: region,
  S3_BUCKET_NAME: Bucket,
} = process.env;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const s3 = new AWS.S3();

function uploadToS3(photoPath) {
  const photoKey = path.basename(photoPath);

  const params = {
    Bucket,
    Key: photoKey,
    Body: fs.createReadStream(photoPath),
  };

  s3.upload(params, (err, data) => {
    if (!err) {
      console.log(`Photo uploaded to S3: ${data.Location}`);
    } else {
      console.error(`Error uploading photo to S3: ${err}`);
    }
  });
}

const opts = {
  width: 1280,
  height: 720,
  quality: 100,
  delay: 0,
  saveShots: true,
  output: 'jpeg',
  device: false, // Use the default webcam
  callbackReturn: 'location',
};

const Webcam = NodeWebcam.create(opts);

const photoDirectory = path.join(__dirname, 'photos');

if (!fs.existsSync(photoDirectory)) {
  fs.mkdirSync(photoDirectory);
}

function capturePhoto() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const photoPath = path.join(photoDirectory, `${timestamp}.jpg`);

  Webcam.capture(photoPath, (err, location) => {
    if (!err) {
      console.log(`Photo captured: ${photoPath}`);
      uploadToS3(photoPath); // Upload to S3 after capturing
    } else {
      console.error(`Error capturing photo: ${err}`);
    }
  });
}

const captureInterval = 5000; // 10 minutes
setInterval(capturePhoto, captureInterval);
