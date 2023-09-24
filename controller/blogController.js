const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoose');

//Creatting a Blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    } catch (err) {
        throw new Error(err);
    }
});

//Updatng the Blog 
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(updateBlog);
    } catch (err) {
        throw new Error(err);
    }
});

//Fetching a Blog
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getblog = await Blog.findById(id).populate('likes').populate('dislikes');
        await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 },
        }, {
            new: true,
        })
        res.json(getblog);
    } catch (err) {
        throw new Error(err);
    }
});

//get All Blogs
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getallblogs = await Blog.find();
        res.json(getallblogs);
    } catch (err) {
        throw new Error(err);
    }
})

//delete a Blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteablog = await Blog.findByIdAndDelete(id);
        res.json(deleteablog);
    } catch (err) {
        throw new Error(err);
    }
})

//Like facility in a Blog
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    // console.log(blogId)
    validateMongoDbId(blogId);

    //find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    //find the login user
    const loginUserId = req?.user?._id;

    //find if the user has liked the blog
    const isLiked = blog?.isLiked;

    //find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString());
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, {
            new: true,
        });
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, {
            new: true,
        });
        res.json(blog);
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, {
            new: true,
        });
        res.json(blog);
    }


});

//Dislike facility in a Blog
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    // console.log(blogId)
    validateMongoDbId(blogId);

    //find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    //find the login user
    const loginUserId = req?.user?._id;

    //find if the user has liked the blog
    const isDisliked = blog?.isDisliked;

    //find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString());
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, {
            new: true,
        });
    }
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, {
            new: true,
        });
        res.json(blog);
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true
        }, {
            new: true,
        });
        res.json(blog);
    }


})

module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog
}