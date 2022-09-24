import { serialize } from "cookie";

export default async function handler(req,res){
    try {
        const option = {
            expires : new Date(0),
            httpOnly : true,
            path : "/",
            sameSite : 'strict'
        }
        res.setHeader("Set-Cookie",serialize('token','',option));
        res.status(200).json({
            success : true,
            message : "Logout successfully"
        });
    } catch (err) {
        res.status(501).json({
            success : false,
            message : err.message
        });
    }
}