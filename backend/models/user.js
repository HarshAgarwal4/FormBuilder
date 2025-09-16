import mongoose from 'mongoose'
import { hashPassword } from '../services/encyption.js';

const TempUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: [
        {
            type: String,
            default: 'normal',
            enum: ['normal' ,'admin']
        }
    ]
},
{
    timestamps: true
})


TempUserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    const r = await hashPassword(this.password)
    this.password = r;
    next();
});

const TempUserModel = mongoose.model('User', TempUserSchema);

export { TempUserModel }