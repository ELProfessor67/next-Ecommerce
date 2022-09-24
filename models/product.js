import {Schema, model, models} from 'mongoose';


const productSchema = new Schema({
	title : {
		type : String,
		required : true
	},
	slug : {
		type : String,
		required : true,
		unique : true
	},
	desc : {
		type : String,
		required : true
	},
	img : {type : String, required : true},
	category : {
		type : String,
		required : true
	},
	size : {
		type : String,
	},
	color : {
		type : String,
	},
	price : {
		type : Number,
		required : true
	},
	available : {
		type : Number,
		required : true
	}
},{timestamps : true});

models = {};

export default model('product',productSchema);