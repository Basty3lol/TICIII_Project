import User from "../models/Users";
import jwt from "jsonwebtoken"

export const verifyToken = async (req,res,next) => {
    try {
        const token = req.headers["x-access-token"]

        if (!token) return res.status(403).json({message: "Invalid token"})

        const decoded = jwt.verify(token,"psycho")
        req.userId = decoded.id;

        const user = await User.findById(req.userId, {password: 0})

        if (!user) return res.status(404).json({message: "User not found"})

        //console.log(decoded)

        //console.log(token)
        next()
    }catch(error){
        return res.status(404).json({message:"Unauthorized"})
    }
}
