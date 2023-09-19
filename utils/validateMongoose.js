const mongoose  = require('mongoose');
const validateMongoDbId = (id) => {
    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
        throw new Error("This id is not Valid or Not found");
    }
}

module.exports = validateMongoDbId;