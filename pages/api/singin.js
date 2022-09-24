import { findDOMNode } from "react-dom";
import {connectDB} from "../../middleware/connectDB";
import User from "../../models/user";
import {compare} from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import {serialize} from 'cookie';

const genToken = async function(_id){
	try {
        // console.log(_id)
		return await sign({_id},process.env.SECRET_KEY);
	} catch (err) {
		console.log(err)
	}
}

async function handler(req,res){
    if(req.method !== "POST"){
        return res.status(401).send(`connot be ${req.method} ${req.url}`);
    }
    try {
        if(!req.body){
            return res.status(401).json({
                success : false,
                message : "please fill all field"
            });
        }
        // check google recaptcha token
        if(!req.body.captcha){
            return res.status(401).json({
                success : false,
                message : "please fill the google recaptcha"
            });
        }

        // checking rechaptcha token valid or not
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PRIVATE_KEY}&response=${req.body.captcha}`;
        let recaptchares = await fetch(url,{method : "POST"});
        recaptchares = await recaptchares.json();
        if(!recaptchares.success){
            return res.status(401).json({
                success : false,
                message : 'Invalid google recaptcha token'
            });
        }

        const user = await User.findOne({email : req.body.email}).select("+password").populate('orders');
        if(!user){
            return res.status(401).json({
                success : false,
                message : 'Invalid detail'
            });
        }
        if(!(await compare(req.body.password,user.password) && req.body.email === user.email)){
            return res.status(401).json({
                success : false,
                message : 'Invalid detail'
            });
        }
        const token = await genToken(user._id);
        const option = {
            expires : new Date(Date.now() + 30 * 20 * 60 * 60 * 1000),
            httpOnly : true,
            path : "/"
        }
        res.setHeader("Set-Cookie",serialize('token',token,option));
        res.status(200).json({
            success : true,
            message : "Login successfully",
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