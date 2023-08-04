import User from "../models/Users";
import jwt from "jsonwebtoken";
import Profesional from "../models/Profesionals"

export const Login = async (req, res) => {

    const UserFound = await User.findOne({email: req.body.email})

    if(!UserFound) return res.status(400).json({message: 'User not found'})

    const matchPassword = await User.verifyPass(req.body.password, UserFound.password)

    if (!matchPassword) return res.status(401).json({token: null, message: 'Invalid Password'})

    const token = jwt.sign({id: UserFound._id},"psycho", {
        expiresIn: 86400
    })

    res.status(200).json({token})
}

export const signUp = async (req, res) => {
    const {rut,email,password} = req.body;

    const prof = await Profesional.findOne({rut: rut})
    const userFound = await User.find({email:email})

    if((await userFound).length > 0){
        res.json("Este correo ya esta registrado")
    }
    else{
        const newUser = new User({
            email,
            rut,
            password: await User.encryptPass(password),
            id_prof: prof._id
        })
        console.log(newUser)

        const savedUser = await newUser.save();

        const token = jwt.sign({id: savedUser._id, token},"psycho",{
            expiresIn: 86400 // 24 hrs
        })

        res.status(200).json({token,message:"success"})
    }
        
}

export const vToken = async (req,res,next) => {
    try {
        const token = req.headers["x-access-token"]

        if (!token) return res.status(403).json({message: "Invalid token"})

        const decoded = jwt.verify(token,"psycho")
        req.userId = decoded.id;

        const user = await User.findById(req.userId, {password: 0})

        if (!user) return res.status(404).json({message: "User not found"})

        //console.log(decoded)

        //console.log(token)
        res.status(200).json({message:"Verified"})
    }catch(error){
        return res.status(404).json({message:"Unauthorized"})
    }
}

export const getUserToken = async (req,res) => {
    try {
        const token = req.headers["x-access-token"]

        if (!token) return res.status(403).json({message: "Invalid token"})

        const decoded = jwt.verify(token,"psycho")
        req.userId = decoded.id;

        const user = await User.findById(req.userId, {password: 0})

        if (!user) return res.status(404).json({message: "User not found"})

        //console.log(decoded)

        //console.log(token)
        res.status(200).json({message:"Verified", u: user})
    }catch(error){
        return res.status(404).json({message:"Unauthorized"})
    }
}