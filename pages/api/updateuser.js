import {connectDB} from "../../middleware/connectDB";
import User from "../../models/user";
import {verify} from 'jsonwebtoken';

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
        const user = await User.findById(decode._id);
        if(!user){
            return res.status(401).json({
                success : false,
                message : "invalid token"
            });
        }
        const {name,address,phone,pincode} = req.body;
                // checking details 
            if(pincode && (pincode.toString().length != 6 || isNaN(pincode))){
                return res.status(400).json({
                    success : false,
                    message : 'please enter 6 digit pincode'
                });
            }
            // checking phone number 
            if(phone && (phone.toString().length != 10 || isNaN(phone))){
                return res.status(400).json({
                    success : false,
                    message : 'please enter 10 digit phone number'
                });
            }
        await User.findByIdAndUpdate(decode._id,{name,address,phone,pincode});
        res.status(200).json({
            success : true,
            message : 'details update successfully'
        });
    } catch (err) {
        res.status(502).json({
            success : false,
            message : err.message
        });
    }
}

export default connectDB(handler);