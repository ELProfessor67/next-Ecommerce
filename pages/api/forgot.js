
import crypto from 'crypto';
import User from '../../models/user';
import sendMail from '../../middleware/mailer';

const genrateResetToken = () => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    return resetToken;
}

export default async function handler(req, res) {
    if(req.method == 'POST'){
        try {
            // console.log(req.body.email)
            const user = await User.findOne({email : req.body.email});
            if(!user){
                return res.status(401).json({
                    success : false,
                    message : "User Not exist"
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
                
            try {

                const resetToken = genrateResetToken();
                const resetDate = Date.now() + 10 * 60 * 1000
                       
                const resetUrl = `http://localhost:3000/forgot?token=${resetToken}`;
                console.log(resetUrl);
                //send mail pending
                const subject = 'Codewear.com password reset';
                const text = `your password reset url is \n ${resetUrl}`;
                const send = await sendMail(req.body.email,subject,text);
                if(!send){
                    return res.status(200).json({
                        success : false,
                        message : "mail sending failed please try again"
                    });
                }

                user.PasswordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
                user.PasswordResetDate = resetDate;
                await user.save();

                res.status(200).json({
                    success : true,
                    message : "Password reset link send successfully send on yout email"
                });
            } catch (err) {
                user.PasswordResetToken = undefined;
                user.PasswordResetDate = undefined;
                await user.save();
                res.status(501).json({
                    success : false,
                    message : err.message
                });
            }

        } catch (err) {
           return res.status(501).json({
                success : false,
                message : err.message
            });
        }
    }else if(req.method == "PUT"){
        try {
            // console.log(req.body.email)
            const token = crypto.createHash('sha256').update(req.body.token).digest('hex');
            const user = await User.findOne({PasswordResetToken: token,PasswordResetDate : {$gt: Date.now()}});
            if(!user){
                return res.status(401).json({
                    success : false,
                    message : "Token Expire"
                });
            }
            // console.log(user.PasswordResetToken);
            user.password = req.body.password;
            user.PasswordResetToken = undefined;
            user.PasswordResetDate = undefined;
            await user.save();

            res.status(200).json({
                success : true,
                message : 'your password reset successfully'
            });

        } catch (err) {
            return res.status(501).json({
                success : false,
                message : err.message
            });
        }
    }else{
        res.status(401).send(`can't be ${req.method} ${req.url}`);
    }
    
    // const resetDate = Date.now();
    // res.status(200).json({ name: resetDate})
}
  