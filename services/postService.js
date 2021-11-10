const Post = require('../models/Post');
const User = require('../models/User');

async function createPost(postData) {
    const post = new Post(postData);
    await post.save();

    return post;
}

async function getAllPosts() {
    const posts = await Post.find({}).lean();

    return posts;
}

async function getPostById(id) {
    const post = await Post.findById(id).populate('author').populate('votes').lean();

    return post;
}

async function editPost(id, postData) {
    const post = await Post.findById(id);

    post.title = postData.title,
        post.keyword = postData.keyword,
        post.location = postData.location,
        post.createDate = postData.createDate,
        post.image = postData.image,
        post.description = postData.description

    return post.save();

}

async function deletePost(postId) {
    await Post.findByIdAndDelete(postId);
}

async function getOwnPosts(userId){
    return await Post.find({author : userId}).populate('author').lean();
}

async function voteUp(postId, userId){
    const post = await Post.findById(postId);
    post.votes.push(userId);

    post.rating++;

    await post.save();
}

async function voteDown(postId, userId){
    const post = await Post.findById(postId);
    post.votes.push(userId);

    post.rating--;

    await post.save();
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    editPost,
    deletePost,
    getOwnPosts,
    voteUp,
    voteDown
}