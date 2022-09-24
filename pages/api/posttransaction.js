import {connectDB} from '../../middleware/connectDB';
import Order from '../../models/order';
import Product from '../../models/product';
import checksum_lib from 'paytmchecksum';

async function handler(req,res){
    // check paytm PaytmChecksum
    var paytmchecksum = '';
    var paytmParam = {};
    const recived_data = req.body;
    for(var key in recived_data){
      if(key == "CHECKSUMHASH"){
        paytmchecksum = recived_data[key];
      }else{
        paytmParam[key] = recived_data[key];
      }
    }
    
    var isvalidCheckSum = checksum_lib.verifySignature(paytmParam,process.env.PAYTM_KEY,paytmchecksum);
    if(!isvalidCheckSum){
      return res.status(500).send("some Error occurred");
    }
    
    let order;
    if(req.body.STATUS == 'TXN_SUCCESS'){
      order = await Order.findOneAndUpdate({OrderId : req.body.ORDERID},{status : "Paid",PaymentIfo : JSON.stringify(req.body),transactionId : req.body.TXNID});
      let products = order.products;
      for(slug in products){
        let product = await Product.findOneAndUpdate({slug : slug},{$inc: {"available" : - produsts[slug].qty}});
        // if(product.available <= 0){
        //   await product.remove();
        // }
      }
    }else if(req.body.STATUS == "PENDING"){
      order = await Order.findOneAndUpdate({OrderId : req.body.ORDERID},{status : "Pending",PaymentIfo : JSON.stringify(req.body),transactionId : req.body.TXNID});
    }
    res.redirect(`/order?id=${order._id}&clearcart=1`,200);
    // res.status(200).json({ body: req.body })
}

export default connectDB(handler);
  