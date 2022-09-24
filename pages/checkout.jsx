import Link from 'next/link';
import { AiOutlineShoppingCart, AiFillPlusCircle, AiFillMinusCircle, AiFillCloseCircle } from 'react-icons/ai';
import {BsFillBagCheckFill} from 'react-icons/bs';
import Script from 'next/script';
import Head from 'next/head';
import { data } from 'autoprefixer';
import { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import {toast} from 'react-toastify';

export default function checkout({cart, addTocart, removefromCart, total,user,setTotal,clearcart}){
	const [amount,setAmount] = useState(0);
	const [key, setKey] =useState(0);
	const [disable, setdisable] = useState(true);

	// form variable
	// const userEmail = user ? user.email : '';
	// const userName = user ? user.name : '';
	const [name, setname] = useState();
	const [email, setemail] = useState();
	const [address, setaddress] = useState('');
	const [phone, setphone] = useState('');
	const [pincode, setpincode] = useState('');
	const [state, setstate] = useState('');
	const [city, setcity] = useState('');
	
	const getpincode = async (pin) => {
		if(pin.length >= 5){
			const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
			const pins = await res.json();
			if(pins.hasOwnProperty(pin)){
				setcity(pins[pin][0]);
				setstate(pins[pin][1]);
			}else{
				setstate('');
				setcity('');
			}
		}else{
			setstate('');
			setcity('');
		}
	}
	const inputHandler = async (e) => {
		if(e.target.name == 'name'){
			setname(e.target.value);
		}else if(e.target.name == 'email'){
			setemail(e.target.value);
		}else if(e.target.name == 'address'){
			setaddress(e.target.value);
		}else if(e.target.name == 'phone'){
			setphone(e.target.value);
		}else if(e.target.name == 'pincode'){
			setpincode(e.target.value);
			getpincode(e.target.value);
		}

		const condition = name.length >= 3 && email.length >= 14 && address.length >= 8 && phone.length >= 10 && pincode.length  >= 5 && Object.keys(cart).length != 0;
		if(condition){
			setdisable(false);
		}else{
			setdisable(true)
		}
	}

	const checkSubtotal = async (items) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getitem?items=${items}`);
			const response = await res.json();
			let amo = 0;
			response.forEach(({price,slug}) => {
				amo += (cart[slug].qty * price);
			});
			setAmount(amo);
			setTotal(amo);
			// console.log(amo,amount)
		} catch (error) {
			console.log(error)
		}
	}

	const addcarthandle = (k,qty,name,size,variant) => {
		addTocart(k,qty,name,size,variant);
		setKey(Math.floor(Math.random() * 100));
	}

	const removecarthandle = (k,qty,name,size,variant) => {
		removefromCart(k,qty,name,size,variant);
		setKey(Math.floor(Math.random() * 100));
	}
	useEffect(() => {
		const items = [];
		for (const item in cart) {
			items.push(item);
		}
		// console.log(items)
		if(items.length > 0){ 
			checkSubtotal(items);
		}
	},[cart,key])
	// console.log(process.env.NEXT_PUBLIC_PAYTM_HOST)
	const initailize = async () => {
		const oid = Math.floor(Math.random() * Date.now());
		const data = {cart, userId:user._id, address, oid, email:user.email, amount, phone, pincode,city,state}
		const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`,{
			method : "POST",
			headers : {
				'Content-type' : 'application/json'
			},
			body : JSON.stringify(data)
		});

		let resTxn = await res.json();
		// console.log(resTxn);
		if(resTxn.success){
			let txnToken = resTxn.txnToken;
			// console.log(response)
			var config = {
				"root": "",
				"flow": "DEFAULT",
				"data": {
				"orderId": oid, /* update order id */
				"token": txnToken, /* update token value */
				"tokenType": "TXN_TOKEN",
				"amount": amount, /* update amount */
				},
				"handler": {
				"notifyMerchant": function(eventName,data){
					// console.log("notifyMerchant handler function called");
					// console.log("eventName => ",eventName);
					// console.log("data => ",data);
				} 
				}
			};
					window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
						// after successfully updating configuration, invoke JS Checkout
						window.Paytm.CheckoutJS.invoke();
					}).catch(function onError(error){
						console.log("error => ",error);
					});
		}else{
			if(resTxn.clearcart){
				clearcart();
			}
			toast.info(resTxn.message, {
				position: "bottom-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,

			});
		}
	}
	const router = useRouter();
	let mess = false;
	useEffect(() => {
		if(!user){
			router.push('/login');
			if(!mess){
				toast.success('Please Login First', {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,

				});
				mess = true
			}
		}
	},[user]);
	useEffect(() => {
		if(user){
			setname(user.name);
			setemail(user.email);
			setaddress(user.address);
			setphone(user.phone);
			setpincode(user.pincode);
			getpincode(user.pincode);
		}
	},[user]);
	return(
			<>
				<Head>
				<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"/>
				<title>checkout -Codewear.com</title>
				</Head>
				<Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}/>
				<div className="container mx-auto">
					<h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>
					<h2 className="font-semibold text-xl my-5">1. Delivery detail</h2>
					<div className="mx-auto flex">
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="name" class="leading-7 text-sm text-gray-600">Name</label>
						        <input type="text" id="name" name="name" value={name} onChange={inputHandler} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="email" class="leading-7 text-sm text-gray-600">Email</label>
						        <input type="email" id="email" name="email" value={email} onChange={inputHandler} readOnly={user} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
					</div>
					<div className="px-2 w-full">
							<div class="mb-4">
						        <label htmlFor="address" class="leading-7 text-sm text-gray-600">Address</label>
						        <textarea type="address" id="address" name="address" value={address} onChange={inputHandler} class="w-full h-[8rem] bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
					</div>
					<div className="mx-auto flex">
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="phone" class="leading-7 text-sm text-gray-600">Phone</label>
						        <input type="phone" id="phone" name="phone" value={phone} onChange={inputHandler} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="pincode" class="leading-7 text-sm text-gray-600">Pincode</label>
						        <input type="text" id="pincode" name="pincode" value={pincode} onChange={inputHandler} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
					</div>
					<div className="mx-auto flex">
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="state" class="leading-7 text-sm text-gray-600">State</label>
						        <input type="text" id="state" name="state" value={state} readOnly class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="city" class="leading-7 text-sm text-gray-600">city</label>
						        <input type="text" id="city" name="city" value={city} readOnly class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
					</div>
					<h2 className="font-semibold text-xl my-5">2. Review Cart Items</h2>
					<div className="sidebar bg-pink-100 p-6 m-2">
						<ol className="list-decimal font-semibold">
							{Object.keys(cart).length === 0 && <div className="my-4 text-base font-normal">Your cart empty</div> }
							{cart && Object.keys(cart).map((k) => {
								return(
									 	<>
									 		<li key={cart[k].name}>
												<div className="item flex my-5">
													<div className="font-semibold">{cart[k].name} ({cart[k].size}/{cart[k].variant})</div>
													<div className="w-1/3 font-semibold flex items-center justify-center text-lg"><AiFillMinusCircle className="cursor-pointer text-pink-500" onClick={() => removecarthandle(k,cart[k].qty,cart[k].name,cart[k].size,cart[k].variant)}/> <span className="mx-2 text-sm">{cart[k].qty}</span> <AiFillPlusCircle className="cursor-pointer text-pink-500" onClick={() => addcarthandle(k,cart[k].qty,cart[k].name,cart[k].size,cart[k].variant,cart[k].avaible)}/></div>
												</div>
											</li>
									 	</>
									);
							})}
						</ol>
						<span className="font-semibold">SubTotal : {Object.keys(cart).length > 0 ? amount : 0}</span>		 
					</div>
					<div className="mx-4">
						<button onClick={initailize} disabled={disable} className="flex text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none disabled:bg-pink-300 hover:bg-pink-600 rounded text-lg mt-8 sm:mt-0"><BsFillBagCheckFill className="m-1"/>Pay ₹{Object.keys(cart).length > 0 ? amount : 0}</button>
					</div>
				</div>
			</>
		);
}