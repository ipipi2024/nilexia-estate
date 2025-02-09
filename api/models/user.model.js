import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        default: 'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
    },
    isAdmin: {
        type: Boolean,
        default: false

    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    phone: {
        type: String,
        required: false
    }
    // Add more fields as needed
}, {timestamps: true})

const User = mongoose.model('User', userSchema);

export default User;