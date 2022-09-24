
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";

export default function Forgot({user}){
	const [email, setemail] = useState('');
	const [password,setPassword] = useState(null);
	const [conPassword,setConPassword] = useState(null);
	const [captcha, setCaptcha] = useState('');

	const router = useRouter();
	useEffect(() => {
		if(user){
			router.push('/');
		}
	},[user]);
	const sendResetEmail = async (e) => {
		try {
			e.preventDefault();
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

			const data = {email,captcha};
			const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`,{
				method : "POST",
				headers : {
					'Content-type' : 'application/json'
				},
				body : JSON.stringify(data)
			});
			
			const response = await res.json();
			if(response.success){
				setemail('');
				toast.success(response.message, {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
	
				});
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
			console.log(err)
		}
	}
	const resetPassword = async (e) => {
		try {
			e.preventDefault();
			if(password != conPassword){
				toast.error('password and confirm password not match', {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
	
				});
			}
			// console.log(router.query.token)
			const data = {password,token:router.query.token};
			const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`,{
				method : "PUT",
				headers : {
					'Content-type' : 'application/json'
				},
				body : JSON.stringify(data)
			});
			
			const response = await res.json();
			if(response.success){
				setPassword('');
				setConPassword('');
				toast.success(response.message, {
					position: "bottom-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
	
				});
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
			console.log(err)
		}
	}
	return(
			<>
				<div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				  <div className="max-w-md w-full space-y-8">
				    <div>
				      <img className="mx-auto h-12 w-auto" src="/logo2.svg" alt="Workflow"/>
				      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
				      <p className="mt-2 text-center text-sm text-gray-600">
				        Or
				        <Link href="/login"><a  className="font-medium text-pink-600 hover:text-pink-500"> Login </a></Link>
				      </p>
				    </div>
					{!router.query.token ?
				    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={sendResetEmail}>
				      <input type="hidden" name="remember" value="true"/>
				      <div className="rounded-md shadow-sm -space-y-px">
				        <div>
				          <label for="email-address" className="sr-only">Email address</label>
				          <input id="email-address" name="email" value={email} onChange={(e) => setemail(e.target.value)} type="email" autocomplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
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
				          Continue
				        </button>
				      </div>
				    </form> :
					<form className="mt-8 space-y-6" action="#" method="POST" onSubmit={resetPassword}>
					<input type="hidden" name="remember" value="true"/>
					<div className="rounded-md shadow-sm -space-y-px">
					  <div>
						<label for="npass" className="sr-only">New Password</label>
						<input id="npass" name="npass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autocomplete="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="New Password"/>
					  </div>
					</div>
					<div className="rounded-md shadow-sm -space-y-px">
					  <div>
						<label for="cnpass" className="sr-only">Confirm New Password</label>
						<input id="cnpass" name="cnpass" type="password" value={conPassword} onChange={(e) => setConPassword(e.target.value)} autocomplete="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="Confirm New Password"/>
					  </div>
					</div>
					<div>
					  <button type="submit" disabled={conPassword != password} className="disabled:bg-pink-300 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
						Reset Password
					  </button>
					  {conPassword && conPassword != password ?
						<span className='text-red-600'>Confirm Password and Password not Match</span>: password && conPassword == password ?
						<span className='text-green-600'>Password Match</span>: ''
					  }
					</div>
				  </form>
					}
				  </div>
				</div>
			</>
		);
}