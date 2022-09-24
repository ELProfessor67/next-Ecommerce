import Product from '../../models/product';
import {connectDB} from '../../middleware/connectDB';


async function handler(req, res) {
  if(req.method !== "PUT"){
    return res.status(400).send(`connot not ${req.method} ${req.url}`);
  }
  // console.log(req.body);
  for(let i = 0; i < req.body.length; i++){
    const p = await Product.findByIdAndUpdate(req.body[i]._id,req.body[i]);
  }
  res.status(201).json({success : true, message : "product update successfully"});
}

export default connectDB(handler);