import {Schema, model} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    rut: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    id_prof: {
        type: Schema.Types.ObjectId,
        required: true
    }
},{ 
    collection : 'users',
    timestamp: true,
    versionKey: false
})

userSchema.statics.encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

userSchema.statics.verifyPass = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}

export default model("User",userSchema);