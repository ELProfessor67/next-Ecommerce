import pincodes from '../../components/pincodes.json';

export default function pincode(req,res){
	res.status(200).json(pincodes);
}