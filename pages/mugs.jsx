import Link from 'next/link';
import Product from '../models/product';
const {connect,connections} = require('mongoose');

export default function mugs({product}){
	return(
			<>
				<section className="text-gray-600 body-font min-h-full">
				  <div className="container px-5 py-24 mx-auto">
				    <div className="flex flex-wrap -m-4 justify-center">
					    {product ? Object.keys(product).map((item) => {
					    	return(
					    			<>
					    				<Link href={`product/${product[item].slug}`}>
									      <div className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-4 ">
									        <a className="block relative rounded overflow-hidden">
									          <img alt="ecommerce" className="object-contain object-top w-full h-full  block" src={product[item].img}/>
									        </a>
									        <div className="mt-4 text-center md:text-left">
									          <h3 className="text-gray-500 text-xs tracking-widest title-font ">{product[item].category}</h3>
									          <h2 className="text-gray-900 title-font text-lg font-medium">{product[item].title}</h2>
									          <p className="mt-1">₹{product[item].price}</p>
									          <div className="mt-1">
									          	{product[item].size.length > 0 && product[item].size.map((size) => {
									          		return(
									          				<span className="border border-grey-600 px-1 mx-1">{size}</span>
									          			);
									          	})}
									          </div>
									          <div className="flex mt-1">
									          	{product[item].color.length > 0 && product[item].color.map((color) => {
									          		// console.log(color)
													//   bg-${color}-500
									          		return(
									          				<button className={`border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none`} style={{background:color}}></button>
									          			);
									          	})}
									          </div>
									        </div>
									      </div>
									    </Link>
					    			</>
					    		);
					    }) : <p>sorry no mugs yet mugs are out of stock</p>}
					</div>
				  </div>
				</section>
			</>
		);
}


export async function getServerSideProps(){
	if(!(connections[0].readyState)){
		await connect(process.env.MONGO_URL);
		console.log('connect succesfully')
	}
	const product = await Product.find({category : 'mugs'});
	const mugs = {};
	  for(let item of product){
	    if(item.title in mugs){
	      if(!mugs[item.title].color.includes(item.color) && item.available > 0){
	        mugs[item.title].color.push(item.color);
	      }
	      if(!mugs[item.title].size.includes(item.size) && item.available > 0){
	        mugs[item.title].size.push(item.size);
	      }
	    }else{
	      mugs[item.title] = JSON.parse(JSON.stringify(item));
	      if(item.available > 0){
	        mugs[item.title].color = [item.color];
	        mugs[item.title].size = [item.size];
	      }else{
			mugs[item.title].color = [];
			mugs[item.title].size = [];
		  }
	    }
  }	return({
		props : {product : JSON.parse(JSON.stringify(mugs))}
	});
}