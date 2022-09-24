import '../styles/globals.css'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {useState,useEffect} from 'react';
import {useRouter} from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar'

export default function MyApp({ Component, pageProps }) {
  const [cart,setCart] = useState({});
  const [total,setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(0);
  const [key, setKey] = useState();
  const router = useRouter();

  const loaduser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/loaduser`);
      const response = await res.json();
      if(response.success){
        setUser(response.user);
      }
    } catch (err) {
      console.log('')
    }
  }

  useEffect(() => {
    // console.log('load hoa')
    router.events.on('routeChangeStart',() => {
      setProgress(40);
    });
    router.events.on('routeChangeComplete',() => {
      setProgress(100);
    });
    try{
      if(localStorage.getItem("cart")){
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    }catch(err){
      console.error(err);
      localStorage.clear();
    }
    loaduser();
  },[router.query,key]);

  const saveCart = (myCart) => {
    localStorage.setItem("cart",JSON.stringify(myCart));
    let subt = 0;
    const keys = Object.keys(myCart);
    for(let i = 0; keys.length > i; i++){
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }

    setTotal(subt);
  }

  const addTocart = (itemCode,qty,price,name,size,variant,avaible) => {
    let newCart = cart;
    if(itemCode in cart){
      // console.log(newCart[itemCode].avaible)
      if(newCart[itemCode].qty < newCart[itemCode].avaible){
        newCart[itemCode].qty = cart[itemCode].qty + 1;
      }else{
        toast.info(`only ${newCart[itemCode].qty} avaible`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
    
        });
      }
    }else{
      setKey(Math.random());
      newCart[itemCode] = {qty : 1,price,name,size,variant,avaible}
      toast.success('Item add successfully', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
  
      });
    }
    setCart(newCart);
    saveCart(newCart);
  }

  const buyNow = (itemCode,qty,price,name,size,variant,avaible) => {
    let newCart = {[itemCode] : {qty,price,name,size,variant,avaible}};
    saveCart({});
    setCart(newCart);
    saveCart(newCart);
    router.push('/checkout');
  }

  const clearcart = () => {
    setCart({});
    saveCart({});
  }

  const removefromCart = (itemCode,qty,price,name,size,variant) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    // console.log(newCart[itemCode]["qty"])
    if(itemCode in newCart){
      newCart[itemCode].qty = cart[itemCode].qty - 1; 
    }
    if(newCart[itemCode]["qty"]==0){
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart);
  }


  return(
      <>
        <LoadingBar
          color='#f11946'
          loaderSpeed={10}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Navbar setUser={setUser} user={user} key={key} cart={cart} addTocart={addTocart} removefromCart={removefromCart} clearcart={clearcart} total={total}/>
        <Component cart={cart} setKey={setKey} setUser={setUser} user={user} setTotal={setTotal} buyNow={buyNow} addTocart={addTocart} removefromCart={removefromCart} clearcart={clearcart} total={total} {...pageProps} />
        <Footer/>
        <ToastContainer
					position="bottom-center"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					theme="dark"
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
      </>
    );
}
