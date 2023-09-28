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
                        asset_id:result.asset_id,
                        public_id:result.public_id,
                    },
                    {
                        resource_type:result.resource_type,
                    }
                );
            }
        });
    });
};


const clodinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve,reject) => {
        cloudinary.uploader.destroy(fileToDelete, (result,error) => {
            if(error){
                reject(error);
                // throw new Error(error);
            }
            else{
                resolve(
                    {
                        url: result.secure_url,
                        asset_id:result.asset_id,
                        public_id:result.public_id,
                    },
                    {
                        resource_type:result.resource_type,
                    }
                );
            }
        });
    });
};


module.exports = {clodinaryUploadImg, clodinaryDeleteImg}