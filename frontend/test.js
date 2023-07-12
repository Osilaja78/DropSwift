import AWS from "aws-sdk";

import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})

const uploadImage = async (file, fileName) => {
    try {
        const s3 = new S3();
    
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: file.data, // Assuming `file` is a Buffer or a ReadableStream
            ACL: 'public-read', // Make the uploaded file publicly accessible
        };
    
        const data = await new Upload({
            client: s3,
            params
        }).done();
        console.log('Image uploaded:', data.Location);
        return data.Location; // Return the uploaded image URL
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
