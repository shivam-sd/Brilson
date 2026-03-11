import React,{useState} from "react"
import axios from "axios"
import { toast } from "react-toastify"

const PayUPayment = ({createdOrder,total}) => {

const token = localStorage.getItem("token")
const [loading,setLoading] = useState(false)

const handlePayU = async()=>{

try{

if(!createdOrder){
toast.error("Create order first")
return
}

setLoading(true)

const res = await axios.post(
`${import.meta.env.VITE_BASE_URL}/api/payment/payu/create`,
{
orderId:createdOrder._id
},
{
headers:{Authorization:`Bearer ${token}`}
}
)

const {paymentUrl,data} = res.data

const form = document.createElement("form")
form.method="POST"
form.action=paymentUrl

Object.keys(data).forEach(key=>{

const input=document.createElement("input")
input.type="hidden"
input.name=key
input.value=data[key]
form.appendChild(input)

})

document.body.appendChild(form)
form.submit()

}catch(err){

console.log(err)
toast.error("PayU payment failed")

}finally{

setLoading(false)

}

}

return(

<button
onClick={handlePayU}
disabled={loading}
className="w-full mt-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold"
>

{loading ? "Processing..." : `Pay ₹${total} with PayU`}

</button>

)

}

export default PayUPayment