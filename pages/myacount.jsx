import {useEffect} from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {toast} from 'react-toastify';

const myacount = ({user,setKey}) => {
    const [name, setname] = useState();
    const [email, setemail] = useState();
    const [address, setaddress] = useState('');
    const [phone, setphone] = useState('');
    const [pincode, setpincode] = useState('');
    const [pass, setpass] = useState('');
    const [newPass, setnewPass] = useState('');
    const [cnewPass, setcnewPass] = useState('');


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
      }else if(e.target.name == 'pass'){
        setpass(e.target.value);
      }else if(e.target.name == 'newPass'){
        setnewPass(e.target.value);
      }else if(e.target.name == 'cnewPass'){
        setcnewPass(e.target.value);
      }
    }

    const router = useRouter();
    useEffect(() => {
        if(!user){
           router.push('/login');
        }
        if(user){
          setname(user.name);
          setemail(user.email);
          setaddress(user.address);
          setphone(user.phone);
          setpincode(user.pincode);
        }
    },[user]);

    const submitDetails = async (e) => {
      try {
        const data = {name,address,pincode,phone};
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser`,{
          method : "PUT",
          headers : {
            'Content-type' : 'application/json'
          },
          body : JSON.stringify(data)
        });
        const response = await res.json();
        if(response.success){
          setKey(Math.random());
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
        console.log(err);
      }
    }

    const passwaordSubmit = async (e) => {
      try {
        e.preventDefault();
        if(cnewPass !== newPass){
          toast.error('new password and confirm new password not match', {
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
        const data = {oldPassword:pass,newPassword:newPass};
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`,{
          method : "PUT",
          headers : {
            'Content-type' : 'application/json'
          },
          body : JSON.stringify(data)
        });
        const response = await res.json();
        if(response.success){
          setnewPass('');
          setpass('');
          setcnewPass('');
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
        console.log(err);
      }
    }
  return (
    <>
      <div className="container mx-auto">
					<h1 className="font-bold text-3xl my-8 text-center">Update Your Acount</h1>
          <h2 className="font-semibold text-xl my-5">1. Delivery details</h2>
					<div className="mx-auto flex">
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="name" class="leading-7 text-sm text-gray-600">Name</label>
						        <input type="text" id="name" name="name" value={name}  onChange={inputHandler} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="email" class="leading-7 text-sm text-gray-600">Email cannot be updated!</label>
						        <input type="email" id="email" name="email" value={email} readOnly={user} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
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
          <div className='mx-2'>
						<button onClick={submitDetails} className="flex text-white bg-pink-500 border-0 p-2 focus:outline-none disabled:bg-pink-300 hover:bg-pink-600 rounded text-lg mt-8 sm:mt-0">Submit</button>
					</div>
          <h2 className="font-semibold text-xl my-5">2. Change Password</h2>
          <form>
					<div className="mx-auto flex">
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="state" class="leading-7 text-sm text-gray-600">Old Password</label>
						        <input type="password" id="pass" name="pass" value={pass} onChange={inputHandler} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
						<div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="city" class="leading-7 text-sm text-gray-600">New Password</label>
						        <input type="password" id="newPass" name="newPass" value={newPass} onChange={inputHandler} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
            <div className="px-2 w-1/2">
							<div class="mb-4">
						        <label htmlFor="city" class="leading-7 text-sm text-gray-600">Confirm New Password</label>
						        <input type="password" id="cnewPass" name="cnewPass" value={cnewPass} onChange={inputHandler} class="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
						    </div>
						</div>
					</div>
          <div className='mx-2'>
						<button onClick={passwaordSubmit} className="flex text-white bg-pink-500 border-0 p-2 focus:outline-none disabled:bg-pink-300 hover:bg-pink-600 rounded text-lg mt-8 sm:mt-0">Submit</button>
					</div>
          </form>
				</div>
    </>
  )
}

export default myacount