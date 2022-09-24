const PaytmChecksum = require('Paytmchecksum');
const https = require('https');
import {connectDB} from '../../middleware/connectDB';
import Order from '../../models/order';
import User from '../../models/user';
import Product from '../../models/product';
import pincodes from '../../components/pincodes.json';
import { notDeepEqual } from 'assert';

async function handler(req, res) {
    if(req.method !== "POST"){
        return res.status(400).send(`connot not ${req.method} ${req.url}`);
    }
    
    // checking pincode available or not
    if(!Object.keys(pincodes).includes(req.body.pincode)){
        return res.status(400).json({
            success : false,
            message : 'your pincode is not serviceable.'
        }); 
    }
    // checking total in 0
    if(req.body.amount <= 0){
        return res.status(400).json({
            success : false,
            message : 'please add some item in your cart'
        }); 
    }

    //check price in data base
    const cart = req.body.cart;
    let subTotal = 0;
    for(let item in cart){
        subTotal += cart[item].price * cart[item].qty;
        const checkOrder = await Product.findOne({slug : item});
        // checking out of stock
        if(checkOrder.available < cart[item].qty){
            return res.status(400).json({
                success : false,
                message : 'the price some item are out of stock please try again',
                clearCart : true
            });
        }
        if(checkOrder.price != cart[item].price){
            return res.status(400).json({
                success : false,
                message : 'the price of some item has been changec please try again',
                clearCart : true
            });
        }
    }
    // checking sub total
    if(subTotal != req.body.amount){
        return res.status(400).json({
            success : false,
            message : 'the price of some item has been changec please try again',
            clearCart : true
        });
    }
    // checking details 
    if(req.body.pincode.length != 6 || isNaN(req.body.pincode)){
        return res.status(400).json({
            success : false,
            message : 'please enter 6 digit pincode'
        });
    }
    // checking phone number 
    if(req.body.phone.length != 10 || isNaN(req.body.phone)){
        return res.status(400).json({
            success : false,
            message : 'please enter 10 digit phone number'
        });
    }
    //fill detail
    const InitializeOrder = {
        userId : req.body.userId,
        OrderId : req.body.oid,
        products : req.body.cart,
        address : req.body.address,
        state : req.body.state,
        city : req.body.city,
        pincode : +req.body.pincode,
        amount : req.body.amount,
        phone : +req.body.phone
    }

    const order = await Order.create(InitializeOrder);
    const user = await User.findById(req.body.userId);
    user.orders.push(order._id);
    await user.save();
    

    var paytmParams = {};
    paytmParams.body = {
        "requestType"   : "Payment",
        "mid"           : process.env.NEXT_PUBLIC_PAYTM_MID,
        "websiteName"   : "YOUR_WEBSITE_NAME",
        "orderId"       : req.body.oid,
        "callbackUrl"   : `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
        "txnAmount"     : {
            "value"     : req.body.amount,
            "currency"  : "INR",
        },
        "userInfo"      : {
            "custId"    : req.body.email,
        },
    };

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
// console.log(req.body.amount)
const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_KEY);

    paytmParams.head = {
        "signature"    : checksum
    };

    var post_data = JSON.stringify(paytmParams);

    const requestAsync = () => {
        return new Promise((resolve,reject) => {
            var options = {

                        /* for Staging */
                //         hostname: 'securegw-stage.paytm.in',
                
                        /* for Production */
                        hostname: 'securegw.paytm.in',
                
                        port: 443,
                        path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': post_data.length
                        }
                    };
                
                    var response = "";
                    var post_req = https.request(options, function(post_res) {
                        post_res.on('data', function (chunk) {
                            response += chunk;
                        });
                
                        post_res.on('end', function(){
                //             console.log('Response: ', response);
                            // console.log(JSON.parse(response).body);
                            let ress = JSON.parse(response).body;
                            ress.success = true;
                            resolve(ress);
                        });
                    });
                
                    post_req.write(post_data);
                    post_req.end();
        });


    }
    let myr = await requestAsync();
    res.status(200).json(myr);
}

export default connectDB(handler);