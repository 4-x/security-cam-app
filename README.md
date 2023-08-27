# Dead Simple Security Camera

A node app built in a hurry to serve as a makeshift home security camera

1. The app takes photos on an interval, saves locally, then pushes to an AWS S3 bucket
2. A lightweight web app serves up the latest image in the bucket

For the web app, only the photo retrieval function is provided.

## Environment Variables
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESSKEY=
S3_BUCKET_REGION=
S3_BUCKET_NAME=
```

## Notes
Node-webcam has different dependencies depending on the operating system. [See documentation](https://github.com/chuckfairy/node-webcam)

## Dependencies
- [node-webcam](https://github.com/chuckfairy/node-webcam)
- [aws-sdk](https://github.com/aws/aws-sdk-js)