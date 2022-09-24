import {connectDB} from "../../middleware/connectDB";
import User from "../../models/user";
import {verify} from 'jsonwebtoken';
import {compare} from 'bcryptjs';

async function handler(req,res){
    if(req.method !== "PUT"){
        return res.status(401).send(`connot be ${req.method} ${req.url}`);
    }
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success : false,
                message : "empty token"
            });
        }
        const decode = await verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decode._id).select('+password');
        if(!user){
            return res.status(401).json({
                success : false,
                message : "invalid token"
            });
        }
        const {oldPassword,newPassword} = req.body;
        const isMatch = await compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(401).json({
                success : false,
                message : 'old password not match'
            });
        }
        // await User.findByIdAndUpdate(decode._id,{password});
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success : true,
            message : 'password update successfully'
        });
    } catch (err) {
        res.status(502).json({
            success : false,
            message : err.message
        });
    }
}

export default connectDB(handler);