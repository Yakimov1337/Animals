const { Schema, model } = require('mongoose');

const schema = new Schema({
    //TODO adapt parameters to project requirements
    title: { type: String, required: [true, "All fields are required"],minlength:6 },
    keyword: { type: String, required: [true, "All fields are required"] ,minlength:6 },
    location: { type: String, required: [true, "All fields are required"],maxlength:10 },
    createDate: { type: String, required: [true, "All fields are required"],match: [/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/, 'Date has to be 10 symbols long!']},
    image: { type: String, required: [true, "All fields are required"],match: [/^http?/, "Image must be valid URL"] },
    description: { type: String, required: [true, "All fields are required"], minlength:8 },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    votes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    rating: { type: Number, default: 0 }


})

module.exports = model('Post', schema);