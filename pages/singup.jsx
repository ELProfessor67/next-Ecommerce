import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {useRouter} from 'next/router';
import ReCAPTCHA from "react-google-recaptcha";

export default function Signup({user}){
	const [name, setName] = useState();
	const [email,setEmail] = useState();
	const [password, setPassword] = useState();
	const [captcha, setCaptcha] = useState('');

	const router = useRouter();

	useEffect(()=>{
		if(user){
			router.push('/myacount')
		}
	},[user]);

	const submitHandler = async (e) => {
		try {
			e.preventDefault();
			if(password.length < 8){
				toast.error('password must be 8 character', {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
	
				});
				return
			}

			if(!captcha){
				toast.error("please fill google ReCAPTCHA", {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				return
			}
			
			const data = {name,email,password,captcha};
			// console.log(data)
			const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/singup`,{
				method : "POST",
				headers: { 'Content-Type': 'application/json' },
        		body: JSON.stringify(data)
			});
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
			}
			setName('');
			setEmail('');
			setPassword('');
		} catch (err) {
			console.log(err)
		}
	}
	return(
			<>
				<div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				  <div className="max-w-md w-full space-y-8">
				    <div>
				      <img className="mx-auto h-20 w-auto" src="/logo2.svg" alt="Workflow"/>
				      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
				      <p className="mt-2 text-center text-sm text-gray-600">
				        Or
				        <Link href="/login"><a  className="font-medium text-pink-600 hover:text-pink-500"> Login </a></Link>
				      </p>
				    </div>
				    <form className="mt-8 space-y-6" onSubmit={submitHandler} method="POST">
				      <input type="hidden" name="remember" value="true"/>
				      <div className="rounded-md shadow-sm -space-y-px">
				      	<div>
				          <label for="name" className="sr-only">Name</label>
				          <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} autocomplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="your name"/>
				        </div>
				        <div>
				          <label for="email-address" className="sr-only">Email address</label>
				          <input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autocomplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
				        </div>
				        <div>
				          <label for="password" className="sr-only">Password</label>
				          <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autocomplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="Password"/>
				        </div>
				      </div>
				      <div>
				      	<ReCAPTCHA
						  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
						  onChange={(value) => setCaptcha(value)}
						/>
				        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
				          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
				            {/*<!-- Heroicon name: solid/lock-closed -->*/}
				            <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
				            </svg>
				          </span>
				          Sign in
				        </button>
				      </div>
				    </form>
				  </div>
				</div>
			</>
		);
}