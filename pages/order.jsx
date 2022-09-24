import {useRouter} from 'next/router';
import Order from '../models/order';
const {connect,connections} = require('mongoose');
import { useEffect } from 'react';

export default function order({order,user,clearcart}){
	const router = useRouter();
	// useEffect(() => {
	// 	if(!order || !user){
	// 		router.push('/');
	// 	}
	// },[order,user])
	// console.log(order.createdAt)
	useEffect(() => {
		if(router.query.clearcart == 1){
			clearcart();
		}
	},[]);
	return(
			<>
				<section className="text-gray-600 body-font overflow-hidden">
				  <div className="container px-5 py-24 mx-auto">
				    <div className="lg:w-4/5 mx-auto flex flex-wrap">
				      <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
				        <h2 className="text-sm title-font text-gray-500 tracking-widest">CodesWear.com</h2>
				        <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-4">Order Id : {order && order.OrderId}</h1>
				        <p className="leading-relaxed mb-4"> Yayy! Your order has been successfully placed</p>
						<p className="leading-relaxed mb-4">Order placed On: {new Date(order.createdAt).toLocaleString()}</p>
						<p>Your payment status is: <span className='font-semibold text-slide-700'>{order && order.status}</span></p>
				        <div class="flex mb-4">
				          <a class="flex-grow text-pink-500 py-2 text-center text-lg px-1">Description</a>
				          <a class="flex-grow border-gray-300 py-2 text-center text-lg px-1">Quantity</a>
				          <a class="flex-grow border-gray-300 py-2 text-center text-lg px-1">Total</a>
				        </div>

						{order && Object.keys(order.products).map((itemCode) => {
							return(
								<>
									<div className="flex border-t border-gray-200 py-2">
										<span className="text-gray-500">{order.products[itemCode].name} ({order.products[itemCode].variant}/{order.products[itemCode].size})</span>
										<span className="m-auto text-gray-900">{order.products[itemCode].qty}</span>
										<span className="m-auto text-gray-900">{order.products[itemCode].price}</span>
									</div>
								</>
							);
						})}
				        <div className="flex">
				          <span className="title-font font-medium text-2xl text-gray-900">Subtotal : {order && order.amount}</span>
				          <button class="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">Track Order</button>
				        </div>
				      </div>
				      <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400"/>
				    </div>
				  </div>
				</section>
			</>
		);
}

export async function getServerSideProps(context){
	if(!(connections[0].readyState)){
		await connect(process.env.MONGO_URL);
		console.log('connect succesfully')
	}
	try {
		const myorder = await Order.findOne({_id : context.query.id});
		return({
			props : {order : JSON.parse(JSON.stringify(myorder))}
		});
	} catch (err) {
		return({
			props : {order : null}
		});
	}
  }