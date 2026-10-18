import { v2 as cloudinary } from 'cloudinary';

async function uploadFile(files){
    const uploadedFiles = [];
    for(const file of files){
        const result = await new Promise((resolve,reject) => {
            cloudinary.uploader
            .upload_stream({
                folder: '2026-10-15-MERN',
                allowed_formats: ["jpg", "png", "webp", "avif"]
            },(error, data) => {
                if(error) return reject(error);

                resolve(data);
            })
            .end(file.buffer);
        });

        uploadedFiles.push(result);
    }

    return uploadedFiles;
} 

export default uploadFile;