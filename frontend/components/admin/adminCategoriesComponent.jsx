import { useContext, useState } from "react";
import CategoriesComponent from "../categoriesComponent";
import { AuthContext } from "../auth/AuthContext";
import { warn, notify } from "@/app/layout";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { baseApiUrl } from "@/apis";

export default function AdminCategoriesComponent() {

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [showCatsForm, setShowCatsForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    
    const {accessToken} = useContext(AuthContext);

    const [addCategoriesForm, setAddCategoriesForm] = useState({
        name: "",
        description: ""
    });

    const changeCatsFormState = () => {
        setShowCatsForm(!showCatsForm);
    };

    const changeDeleteFromState = () => {
        setShowDeleteForm(!showDeleteForm);
    };

    const handleAddCategoriesFormChange = (e) => {
        setResponse('');
        setError('');
        const {name, value} = e.target;
        setAddCategoriesForm((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleDeleteFormChange = (e) => {
        setCategoryId(e.target.value);
    }

    const handleAddCategoriesSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setResponse('');
        setError('');
        try {
            const res = await axios.post(`${baseApiUrl}/category`, addCategoriesForm, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            console.log(res);
            setResponse(res.data);
            setLoading(false);
            setAddCategoriesForm({});
        } catch (err) {
            setLoading(false);
            console.log(err);
            setError(err.response.data.detail);
        }
    }

    const handleDeleteCategoriesSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setResponse('');
        setError('');
        try {
            const res = await axios.post(`${baseApiUrl}/category/${categoryId}`, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            console.log(res);
            setResponse(res.data);
            setLoading(false);
            setShowDeleteForm({});
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
        <div className="flex justify-between">
            <div className="max-w-max">
                <p>All Available Categories</p>
                <hr />
                <CategoriesComponent />
            </div>
            <div>
                <button className="bg-[#145DA0] p-3 text-white rounded-md my-3 disabled:bg-[#2696ff]" onClick={changeCatsFormState} type="submit" disabled={loading}>{showCatsForm ? 'Close Form' : 'Add a new category'}</button>
                {showCatsForm && <form onSubmit={handleAddCategoriesSubmit} action="" className="flex flex-col gap-2">
                    <label htmlFor="name">Category Name</label>
                    <input type="text" name="name" onChange={handleAddCategoriesFormChange} placeholder="Enter category name" className="border p-2" />

                    <label htmlFor="description">Category Description</label>
                    <input type="text" name="description" onChange={handleAddCategoriesFormChange} placeholder="Enter short description" className="border p-2" />
                    <button className="bg-[#145DA0] p-3 text-white rounded-md my-3 disabled:bg-[#2696ff]" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
                </form>}
            </div>
            <div>
                <button className="bg-[#a01414] p-3 text-white rounded-md my-3 disabled:bg-[#2696ff]" onClick={changeDeleteFromState} type="submit" disabled={loading}>Delete a category</button>
                {showDeleteForm && <form onSubmit={handleDeleteCategoriesSubmit} action="" className="flex flex-col gap-2">
                    <label htmlFor="category_id">Category ID</label>
                    <input type="text" name="category_id" onChange={handleDeleteFormChange} placeholder="Enter category ID" className="border p-2" />
                    <button className="bg-[#145DA0] p-3 text-white rounded-md my-3 disabled:bg-[#2696ff]" type="submit" disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
                </form>}
            </div>
            <ToastContainer />
        </div>
    )
}