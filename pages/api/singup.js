import {connectDB} from '../../middleware/connectDB';
import User from '../../models/user';

async function handler(req,res){
    if(req.method !== "POST"){
        return res.status(404).send(`cannot be ${req.method} ${req.url}`);
    }
    try {
        if(!req.body){
            return res.status(501).json({
                success : false,
                message : 'please fill all field'
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
        
        await User.create(req.body);
        res.status(201).json({
            success : true,
            message : 'registeration successfull'
        });
    } catch (err) {
        console.log(err.message)
        res.status(401).json({
            success : false,
            message : err.message
        })
    }
}

export default connectDB(handler);