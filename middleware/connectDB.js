const {connect,connections} = require('mongoose');

export const connectDB = handler => async (req,res) => {
	try{
		if(connections[0].readyState){
			return handler(req,res);
		}
		
		await connect(process.env.MONGO_URL);
		return handler(req,res);
	}catch(err){
		console.log(err);
	}
}