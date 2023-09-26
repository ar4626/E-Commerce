const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

const clodinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve,reject) => {
        cloudinary.uploader.upload(fileToUploads, (result,error) => {
            if(error){
                reject(error);
                // throw new Error(error);
            }
            else{
                resolve(
                    {
                        url: result.secure_url,
                    },
                    {
                        resource_type:result.resource_type,
                    }
                );
            }
        });
    });
};


module.exports = clodinaryUploadImg