import AWS from 'aws-sdk';

async function getPhotoPathFromAWS() {
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

  return new Promise((resolve, reject) => {
    const params = {
      Bucket,
      Prefix: '',
    };

    s3.listObjectsV2(params, (err, data) => {
      if (!err) {
        if (data.Contents.length > 0) {
          const latestObject = data.Contents.sort(
            (a, b) => b.LastModified - a.LastModified
          )[0];
          const imageUrl = s3.getSignedUrl('getObject', {
            Bucket: s3BucketName,
            Key: latestObject.Key,
          });
          resolve(imageUrl);
        }
      } else {
        reject(`Error listing objects in S3: ${err}`);
      }
    });
  });
}
