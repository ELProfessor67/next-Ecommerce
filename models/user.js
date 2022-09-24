import {Schema, model, models} from 'mongoose';
import { hash } from 'bcryptjs';
import order from './order';

const productSchema = new Schema({
	name : {
		type : String,
		required : true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	password : {
		type : String,
		required : true,
		select : false
	},
	address : {
		type : String,
		default : ''
	},
	pincode : {
		type : String,
		default : ''
	},
	phone : {type : Number, min : [10,'phone number must be 10 digits'],default: ''},
	orders : [{type : Schema.Types.ObjectId, ref: order}],
	PasswordResetToken : {type : String,default : ''},
	PasswordResetDate : {type : String,default : ''}
},{timestamps : true});

models = {};

// encrypt password
productSchema.pre('save',async function(next){
	// console.log(this.password)
	if(this.isModified('password')){
		this.password = await hash(this.password,10);
		// await this.save();
		next()
	}
	next()
});



export default model('user',productSchema);