import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { readJson } from "./utils.js";

const service_account = readJson("serviceaccount.json");

initializeApp({
    credential: cert(service_account),
    storageBucket: 'offline-documentation-nn.appspot.com'
});

const bucket = getStorage().bucket();

const getBucket = () => {
    return bucket;
};

const uploadFile = async (filePath, remoteFileName) => {
    return await bucket.upload(filePath, { destination: remoteFileName });
};

export { getBucket, uploadFile };
