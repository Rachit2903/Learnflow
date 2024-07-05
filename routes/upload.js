
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { v4: uuid } = require("uuid");

const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require("../config/keys");
const { Router } = require("express");
const { ensureAuth } = require("../middleware/auth");

const bucket = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

const getPresignedUrl = async (fileName, fileType) => {
    console.log(fileName, fileType);
    const uniqueFileName =
        fileName.split(".")[0] + "-" + uuid() + "." + fileType.split("/")[1];
    console.log(uniqueFileName);

    const command = new PutObjectCommand({
        Bucket: "learnflow-app-bucket",
        Key: uniqueFileName,
        ContentType: fileType,
    });

    const url = await getSignedUrl(bucket, command, { expiresIn: 3600 });
    return {
        url,
        fileName: uniqueFileName,
    }
}

const router = new Router();

router.get("/presignedUrl", ensureAuth, async (req, res) => {
    try {
        const { fileName, fileType } = req.query;
        if (!fileName || !fileType) {
            return res.status(500).send({
                error: "something went wrong",
            })
        }

        const urlResponse = await getPresignedUrl(fileName, fileType);
        console.log(urlResponse);
        res.status(200).send(urlResponse);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: "Something went wrong",
        })
    }
})

module.exports = router;