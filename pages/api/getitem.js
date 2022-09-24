import Product from '../../models/product';
import {connectDB} from '../../middleware/connectDB';


async function handler(req, res) {
    if(!(req.query.items)){
        return res.status(401).json({
            success : false,
        });
    }
    const itemsList = req.query.items.split(',');
    const items = [];
    for (const element of itemsList) {
        const item = await Product.find({slug : element});
        // console.log(item)
        items.push(item[0]);
    }
    // console.log(items)
  res.status(200).json(items);
}

export default connectDB(handler);