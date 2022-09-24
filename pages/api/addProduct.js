import Product from '../../models/product';
import {connectDB} from '../../middleware/connectDB';


async function handler(req, res) {
  if(req.method !== "POST"){
    return res.status(400).send(`connot not ${req.method} ${req.url}`);
  }
  try{
    console.log('p',req.body)
    for(let i = 0; i < req.body.length; i++){
    let p = new Product({
      title: req.body[i].title,
      slug: req.body[i].slug,
      desc: req.body[i].desc,
      category: req.body[i].category,
      img: req.body[i].img,
      size: req.body[i].size,
      color: req.body[i].color,
      price: req.body[i].price,
      available: req.body[i].available
    });
    await p.save();
    }
    res.status(201).json({success : true, message : "product add successfully"});
  }catch(err){
    console.log(err.message)
    res.status(500).json({success : false, message : err.message})
  }
  }

export default connectDB(handler);