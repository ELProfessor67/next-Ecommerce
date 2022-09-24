import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineShoppingCart, AiFillPlusCircle, AiFillMinusCircle, AiFillCloseCircle } from 'react-icons/ai';
import {BsFillBagCheckFill} from 'react-icons/bs';
import {MdAccountCircle} from 'react-icons/md';
import {useEffect, useRef, useState} from 'react';
import cookie from 'js-cookie';
import {toast} from 'react-toastify';
import { useRouter } from 'next/router';

export default function Navbar({cart,addTocart, removefromCart, clearcart, total,user,setUser}){
	// console.log(cart,addTocart, removefromCart, clearcart, total);
	// console.log(Object.keys(cart).length)
	const ref = useRef(null);
	const router = useRouter();
	const [sidebar, setSideBar] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if(Object.keys(cart).length !== 0){
			setSideBar(true);
			setOpen(true);
		}
		const notShowingpath = ['/checkout','/order','/orders'];
		if(notShowingpath.includes(router.pathname)){
			setSideBar(false);
		}
	},[cart]);

	const [dropDown, setDropDown] = useState(false);

	const toggleCart = () => {
		if(ref.current.classList.contains("translate-x-full")){
			ref.current.classList.remove('translate-x-full');
			ref.current.classList.add('translate-x-0')
			setOpen(true);
			return
		}
		ref.current.classList.add('translate-x-full');
		ref.current.classList.remove('translate-x-0');
		setOpen(false);
		
	}

	const logout = async () => {
		try {
			const res = await fetch('http://localhost:3000/api/logout');
			const response = await res.json();
			if(response.success){
				toast.success(response.message, {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
			
				});
				setUser(null);
				setDropDown(false);
			}else{
				toast.error(response.message, {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
			
				});
			}

		} catch (err) {
			toast.error(err.message, {
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
	return(
			<>
				<header className={`flex flex-col md:flex-row justify-center md:justify-start items-center py-2 md:px-4 shadow-md sticky top-0 z-20 bg-white`}>
					<div className="logo mr-auto ml-1 md:mx-5">
						<Link href="/"><a><Image src="/logo1.svg" alt="logo1" width={250} height={40}/></a></Link>
					</div>
					<nav className="nav">
						<ul className="flex items-center space-x-4 font-bold md:text-md xl:text-xl">
							<Link href="/tshirt"><a><li className="hover:text-pink-600">Tshirt</li></a></Link>
							<Link href="/hoodies"><a><li className="hover:text-pink-600">Hoodies</li></a></Link>
							<Link href="/stickers"><a><li className="hover:text-pink-600">Stickers</li></a></Link>
							<Link href="/mugs"><a><li className="hover:text-pink-600">Mugs</li></a></Link>
						</ul>
					</nav>
					<div className="cart absolute right-0 top-4 mx-5 flex gap-1 md:gap-2">
						{!user ? <Link href="/login"><button className='py-1 px-2 rounded-md text-md text-white bg-pink-500 hover:bg-pink-600'>Login</button></Link> :
						<MdAccountCircle onMouseEnter={() => setDropDown(true)} onMouseLeave={() => setDropDown(false)} className=" text-xl md:text-3xl cursor-pointer"/>}
						{dropDown && <div onMouseLeave={() => setDropDown(false)} onMouseEnter={() => setDropDown(true)} className='absolute right-12 top-7 bg-pink-500 py-3 px-6 w-[9rem]'>
							<ul>
								<Link href={'/myacount'}><a><li className='text-md tex-black cursor-pointer font-semibold my-2 hover:text-pink-700'>My Acount</li></a></Link>
								<Link href={'/orders'}><a><li className='text-md tex-black cursor-pointer font-semibold my-2 hover:text-pink-700'>My Orders</li></a></Link>
								<li onClick={() => logout()} className='text-md tex-black cursor-pointer font-semibold my-2 hover:text-pink-700'>Logout</li>
							</ul>
						</div>}
						<button onClick={toggleCart}><AiOutlineShoppingCart className=" text-xl md:text-3xl"/></button>
					</div>
					<div className={`sidebar overflow-y-auto absolute right-0 top-0 bg-pink-100 p-10 px-8 transform transition-transform ${sidebar ? 'translate-x-0' : 'translate-x-full'} w-72 h-full h-[100vh]`} ref={ref}>
						<h2 className="font-bold text-xl text-center">Shoping cart</h2>
						<span className="absolute right-2 top-2 cursor-pointer text-2xl text-pink-500" onClick={toggleCart}><AiFillCloseCircle/></span>
						<ol className="list-decimal font-semibold">
							{Object.keys(cart).length === 0 && <div className="my-4 text-base font-normal">Your cart empty</div> }
							{cart && Object.keys(cart).map((k) => {
								return(
									 	<>
									 		<li key={cart[k].slug}>
												<div className="item flex my-5">
													<div className="w-2/3 font-semibold">{cart[k].name} ({cart[k].size}/{cart[k].variant})</div>
													<div className="w-1/3 font-semibold flex items-center justify-center text-lg"><AiFillMinusCircle className="cursor-pointer text-pink-500" onClick={() => removefromCart(k,cart[k].qty,cart[k].name,cart[k].size,cart[k].variant)}/> <span className="mx-2 text-sm">{cart[k].qty}</span> <AiFillPlusCircle className="cursor-pointer text-pink-500" onClick={() => addTocart(k,cart[k].qty,cart[k].name,cart[k].size,cart[k].variant,cart[k].avaible)}/></div>
												</div>
											</li>
									 	</>
									);
							})}
						</ol>
						<div className="font-semibold my-2">SubTotal : {total}</div>		 
						 <div className="flex gap-2 justify-center items-center f-wrap">
						 	<Link href="/checkout"><button disabled={Object.keys(cart).length == 0} className=" disabled:bg-pink-300 flex text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg mt-8 sm:mt-0"><BsFillBagCheckFill className="m-1"/>Checkout</button></Link>
						 	<button disabled={Object.keys(cart).length == 0} className="flex disabled:bg-pink-300 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg mt-8 sm:mt-0" onClick={clearcart}>Clear Cart</button>
						 </div>
					</div>
				</header>
			</>
		);
}