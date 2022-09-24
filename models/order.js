import {Schema, model, models} from 'mongoose';


const orderSchema = new Schema({
	userId : {type : Schema.Types.ObjectId, ref : 'user', required : true},
	OrderId : {type : String, required : true},
	PaymentIfo : {type : String, default : ''},
	products : {type : Object, required : true},
	transactionId : {type : String, default : ''},
	address : {type : String, required : true},
	state : {type : String, required : true},
	city : {type : String, required : true},
	pincode : {type : Number, required : true},
	amount : {type : Number, required : true},
	status : {type : String, default : 'Initializing', required : true},
	Orderstatus : {type : String, default : 'unshipped', required : true},
	phone : {type : Number, required : true, min : [10,'phone number must be 10 digits']}
},{timestamps : true});

models = {};

export default model('order',orderSchema);