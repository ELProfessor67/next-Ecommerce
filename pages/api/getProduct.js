import Product from '../../models/product';
import {connectDB} from '../../middleware/connectDB';


async function handler(req, res) {
  const product = await Product.find();
  const shirt = {};
  for(let item of product){
    if(item.title in shirt){
      if(!shirt[item.title].color.includes(item.color) && item.available > 0){
        shirt[item.title].color.push(item.color);
      }
      if(!shirt[item.title].size.includes(item.size) && item.available > 0){
        shirt[item.title].size.push(item.size);
      }
    }else{
      shirt[item.title] = JSON.parse(JSON.stringify(item));
      if(item.available > 0){
        shirt[item.title].color = [item.color];
        shirt[item.title].size = [item.size];
      }
    }
  }
  // console.log(shirt)
  res.status(200).json(shirt);
}

export default connectDB(handler);