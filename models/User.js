const { Schema, model } = require('mongoose');

const schema = new Schema({
    //TODO adapt parameters to project requirements
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    userPosts: [{ type: Schema.Types.ObjectId, ref: 'Post', default: [] }]
})

module.exports = model('User', schema);