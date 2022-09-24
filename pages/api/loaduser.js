import {connectDB} from "../../middleware/connectDB";
import User from "../../models/user";
import {verify} from 'jsonwebtoken';


async function handler(req,res){
    if(req.method !== "GET"){
        return res.status(401).send(`connot be ${req.method} ${req.url}`);
    }
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success : false
            });
        }
        const decode = await verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decode._id).populate('orders');
        if(!user){
            return res.status(401).json({
                success : false
            });
        }
        res.status(200).json({
            success : true,
            user
        });

    } catch (err) {
        res.status(501).json({
            success : false,
            message : err.message
        });
    }
}

export default connectDB(handler);