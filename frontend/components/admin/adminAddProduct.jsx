import { useContext, useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { warn, notify } from "@/app/layout";
import { ToastContainer } from "react-toastify";
import { baseApiUrl } from "@/apis";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    }
})

export default function AdminAddProductComponent() {

    const [mainImageFile, setMainImageFile] = useState(null);
    const [imageOneFile, setImageOneFile] = useState(null);
    const [imageTwoFile, setImageTwoFile] = useState(null);
    const [imageThreeFile, setImageThreeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const { accessToken } = useContext(AuthContext);

    const [ uploadForm, setUploadForm ] = useState({
        product_name: "",
        description: "",
        price: "",
        rating: "",
        category: "",
        main_image_url: "",
        image_one_url: "",
        image_two_url: "",
        image_three_url: "",
    });

    const handleFormChange = (event) => {
        setError('');
        setResponse('');
        const { name, value } = event.target;
        setUploadForm((prevState) => {
            return {
            ...prevState,
            [name]: value,
            };
        });
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        setMainImageFile(file);
    };
      
    const handleImageOneChange = (e) => {
        const file = e.target.files[0];
        setImageOneFile(file);
    };
    
    const handleImageTwoChange = (e) => {
        const file = e.target.files[0];
        setImageTwoFile(file);
    };
    
    const handleImageThreeChange = (e) => {
        const file = e.target.files[0];
        setImageThreeFile(file);
    };
    
    const uploadImage = async (file) => {

        const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
        const region = process.env.NEXT_PUBLIC_AWS_REGION;
        const key = Date.now().toString() + '-' + file.name;

        const putParams = {
            Bucket: bucket,
            Key: key,
            Body: file,
            ACL: 'public-read',
        };

        try {
            await s3Client.send(new PutObjectCommand(putParams));
            const s3ObjectUrl = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
            return s3ObjectUrl.href;
        } catch (err) {
            console.log("Error uploading image to S3 ->", err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const mainImageUrl = await uploadImage(mainImageFile);
            const imageOneUrl = await uploadImage(imageOneFile);
            const imageTwoUrl = await uploadImage(imageTwoFile);
            const imageThreeUrl = await uploadImage(imageThreeFile);

            uploadForm.main_image_url = mainImageUrl;
            uploadForm.image_one_url = imageOneUrl;
            uploadForm.image_two_url = imageTwoUrl;
            uploadForm.image_three_url = imageThreeUrl;
        
            console.log('Upload form ->', uploadForm);
            try {
                const res = await axios.post(`${baseApiUrl}}/product`, uploadForm, {
                    headers:{
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                setResponse(res.data.message);
                setLoading(false);
            } catch (err) {
                setError("My backend error -> ", err);
                setLoading(false);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error uploading images:', error);
        }
    };

    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}
    
    return (
        <div>
            <form onSubmit={handleFormSubmit} action="" className="flex flex-col gap-4 max-w-[500px] m-auto">
                <label htmlFor="product_name">Product Name</label>
                <input type="text" name="product_name" onChange={handleFormChange} className="border rounded-lg p-2" required/>

                <label htmlFor="description">Product Description</label>
                <input type="text" name="description" onChange={handleFormChange} className="border rounded-lg p-2" required/>

                <label htmlFor="price">Price</label>
                <input type="text" name="price" onChange={handleFormChange} className="border rounded-lg p-2" required />

                <label htmlFor="rating">Rating</label>
                <input type="number" name="rating" onChange={handleFormChange} className="border rounded-lg p-2" required />

                <label htmlFor="category">Category</label>
                <input type="text" name="category" onChange={handleFormChange} className="border rounded-lg p-2" required />

                <label htmlFor="main-image">Main Image</label>
                <input type="file" name="main-image" accept="image/*" onChange={handleMainImageChange} className="border rounded-lg" required />

                <label htmlFor="image-one">Image One</label>
                <input type="file" name="image-one" accept="image/*" onChange={handleImageOneChange} className="border rounded-lg" required />

                <label htmlFor="image-two">Image Two</label>
                <input type="file" name="image-two" accept="image/*" onChange={handleImageTwoChange} className="border rounded-lg" required />

                <label htmlFor="image-three">Image Three</label>
                <input type="file" name="image-three" accept="image/*" onChange={handleImageThreeChange} className="border rounded-lg" required />
                
                <button className="bg-[#145DA0] p-3 text-white rounded-md my-3 disabled:bg-[#2696ff]" type="submit" disabled={loading} >{loading ? "Loading..." : "Submit"}</button>
            </form>
            <ToastContainer />
        </div>
    )
}