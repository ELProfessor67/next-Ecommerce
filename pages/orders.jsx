import Order from '../models/order';
const { connect, connections } = require('mongoose');
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function orders({user}) {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            if(!user){
                router.push('/login');
            }
        },2000);
    },[user]);
    // user && console.log(user.orders)
    return (
        <>
            <div className="container mx-auto py-5 min-h-screen">
                <h1 className="text-center fone-semibold text-2xl">My Orders</h1>
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-white border-b">
                                        <tr>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                Id
                                            </th>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                Name
                                            </th>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                Amount
                                            </th>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user && user.orders.map(({_id,products,amount,OrderId}) => {
                                        return <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{_id}</td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    {products[Object.keys(products)[0]].name}
                                                    </td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                        {amount}
                                                    </td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                        <Link href={`/order?id=${_id}`}><a>Details</a></Link>
                                                    </td>
                                                </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export async function getServerSideProps() {
    if (!(connections[0].readyState)) {
        await connect(process.env.MONGO_URL);
        console.log('connect succesfully')
    }
    const orders = await Order.find();
    return ({
        props: { orders: JSON.parse(JSON.stringify(orders)) }
    });
}