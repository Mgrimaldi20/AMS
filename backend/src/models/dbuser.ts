import mongoose from "mongoose"

const dbuser = new mongoose.Schema({
    googleid: {
        required: false,
        type: String
    },
    twitterid: {
        required: false,
        type: String
    },
    githubid: {
        required: false,
        type: String
    },
    password: {
        required: false,
        type: String
    },
    username: {
        required: false,
        type: String
    },
    email: {
        required: false,
        unique: true,                           //email must be unique
        type: String
    },
    isadmin: {
        required: true,
        default: false,                         //don't need to add to strategy, default auto includes isadmin field
        type: Boolean
    }
})

export default mongoose.model("User", dbuser)