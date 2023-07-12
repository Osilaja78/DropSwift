import axios from "axios";
import { warn, notify } from "@/app/layout";
import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { ToastContainer } from "react-toastify";

export default function ChangeOrderStatusComponent() {

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const { accessToken } = useContext(AuthContext);

    const [changeOrderStatusForm, setChangeOrderStatusForm] = useState({
        order_id: "",
        order_status: ""
    });

    const handleFormChange = (e) => {
        setResponse('');
        setError('');
        const {name, value} = e.target;
        setChangeOrderStatusForm((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setResponse('');
        setError('');
        console.log(changeOrderStatusForm);
        try {
            const res = await axios.put('http://localhost:8000/change-order-status', {
                params: changeOrderStatusForm,
                headers:{
                    ContentType: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            console.log(res);
            setResponse(res.data);
            setLoading(false);
            setChangeOrderStatusForm({});
        } catch (err) {
            setLoading(false);
            console.log(err);
            setError(err.response.data.detail);
        }
    }

    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}

    return (
        <div>
            <form action="" onSubmit={handleFormSubmit} className="flex flex-col max-w-[400px] m-auto gap-4">
                <label htmlFor="order_id">Order ID</label>
                <input type="text" name="order_id" onChange={handleFormChange} placeholder="Enter order ID" className="border p-2 rounded-md" />

                <label htmlFor="order_status">Status</label>
                <input type="text" name="order_status" onChange={handleFormChange} placeholder="Enter short description" className="border p-2 rounded-md" />
                <p className="text-gray-400">Order status can only take the following values: Pending, Confirmed, Shipped, Delivered.</p>
                <button className="bg-[#145DA0] p-3 text-white rounded-md my-3 disabled:bg-[#2696ff]" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
            </form>
            <ToastContainer />
        </div>
    )
}