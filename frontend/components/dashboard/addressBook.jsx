import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import editIcon from "../../public/editIcon.svg";
import Image from "next/image";
import axios from "axios";
import { contains } from "jquery";
import { warn, notify } from "@/app/layout";
import { ToastContainer } from "react-toastify";

export default function AddressBook() {

    const { userDetails, user, accessToken } = useContext(AuthContext);
    const [loading, isLoading] = useState(null);
    const [editForm, setEditForm] = useState(false);
    const [error, setError] = useState('');
    const [response, setResponse] = useState('');

    const [editAddressForm, setEditAddressForm] = useState({
        address_one: "",
        address_two: "",
        city: "",
        postal_code: "",
        phone: ""
    });

    const handleChange = (event) => {
        setError('');
        setResponse('');
        const { name, value } = event.target;
        setEditAddressForm((prevState) => {
            return {
            ...prevState,
            [name]: value,
            };
        });
    };

    const handleEditClick = () => {
        setEditForm(!editForm);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        isLoading(true);
        setResponse('');
        setError('');
        
        try {
            let res;
            if (userDetails[0]) {
                res = await axios.put('http://localhost:8000/user-details', editAddressForm, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
            } else {
                res = await axios.post('http://localhost:8000/user-details', editAddressForm, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
            }
            console.log(res);
            setResponse(res.data.message);
            isLoading(false);
        } catch (err) {
            console.log(err);
            setError(err.response.data.detail);
            console.log(err.response.data.detail);
            isLoading(false);
        }
    };

    if (error) {
		warn(`${error}`);
	}

	// display success message component
	if (response) {
		notify(`${response}`)
	}

    return (
        <>
            {user && <div className="grid grid-cols-2 gap-10">
                <div className="col-span-1 border rounded-sm max-h-max">
                    <h1 className="p-5 text-[16px]">My Details</h1>
                    <hr />
                    <p className="p-3">{user.firstName} {user.lastName ? user.lastName : ''}</p>
                    <p className="p-3">{user.email}</p>
                </div>
                <div className="col-span-1 border rounded-sm">
                    <div className="flex justify-between">
                        <h1 className="p-5 text-[16px]">Address Book</h1>
                        <div className="mr-3 my-2 cursor-pointer hover:bg-[#0c2d482d] rounded-full p-2 flex items-center">
                            <Image src={editIcon} alt="edit-icon" onClick={handleEditClick}/>
                        </div>
                    </div>
                    <hr />
                    { userDetails[0] ? <div className={editForm === true ? "hidden" : "block"}>
                        <p className="p-3">Address: {userDetails[0].address_one}, {userDetails[0].address_two}, {userDetails[0].city}, {userDetails[0].country ? userDetails[0].country : ''}</p>
                        <p className="p-3">Phone: {userDetails[0].phone}</p>
                        <p className="p-3">Postal Code: {userDetails[0].postal_code}</p>
                    </div> : <p className={ editForm === true ? "hidden" : "text-center mt-5 text-gray-400"}>None yet. Add or update your address details.</p>}

                    {/* ***** UPDATE ADDRESS FORM ****** */}
                    { editForm && <div className="p-5 mt-3 text-[16px]">
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <label htmlFor="address">Address</label>
                            <input type="text" value={editAddressForm.address_one} onChange={handleChange} name="address_one" placeholder="Enter address"  className=" border border-gray-300 rounded-md mb-2 p-2"/>


                            <label htmlFor="city">Country</label>
                            <input type="text" value={editAddressForm.address_two} onChange={handleChange} name="address_two" placeholder="Enter country of residence"  className=" border border-gray-300 rounded-md mb-2 p-2" />

                            <label htmlFor="city">City</label>
                            <input type="text" value={editAddressForm.city} onChange={handleChange} name="city" placeholder="Enter city"  className=" border border-gray-300 rounded-md mb-2 p-2" />

                            <label htmlFor="post-code">Postal Code</label>
                            <input type="text" value={editAddressForm.postal_code} onChange={handleChange} name="postal_code" placeholder="Enter postal code"  className=" border border-gray-300 rounded-md mb-2 p-2" />

                            <label htmlFor="phone">Phone</label>
                            <input type="text" value={editAddressForm.phone} onChange={handleChange} name="phone" placeholder="Enter phone number"  className=" border border-gray-300 rounded-md mb-2 p-2" />
                            <p className="text-gray-100">Format: +234999999999</p>
                            
                            <button className="bg-[#145DA0] p-3 text-white rounded-md my-3 max-w-max mt-4">{loading ? 'Loading...' : 'Update'}</button>
                        </form>
                    </div>}
                </div>
            </div>}
            <ToastContainer />
        </>
    )
}