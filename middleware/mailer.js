import mailer from 'nodemailer';

const transport = mailer.createTransport({
	host : "smtp.gmail.com",
	port : 465,
	secure : true,
	auth : {
		user : process.env.GMAIL,
		pass : process.env.GMAIL_PASS
	}
});

const sendMail = async (to,subject,text) => {
    return new Promise((resolve,reject) => {
        const mailContent = {
            from : 'jeeshanr599@gmail.com',
            to,
            subject,
            text
        };
        transport.sendMail(mailContent,(err,info)=>{
            if(err){
                reject(false)
            }else{
                resolve(true)
            }
        });
    });
}

export default sendMail;