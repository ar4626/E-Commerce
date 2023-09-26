const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,

    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    images: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fblog.html&psig=AOvVaw094w90H2Q19kHxIYPs1sE2&ust=1695546782234000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCOjO7o-ywIEDFQAAAAAdAAAAABAE"
    },
    author: {
        type: String,
        default: "Admin"
    },
    images:[],
}, {
    toJSON: {
        virtuals: true,
    }, 
    toObject: {
        virtuals: true,
    },
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);