import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log("Form submitted:", formData);

            const res = await axios.post("http://localhost:5000/api/admin/login", formData);

            if (res.status === 200) {
                navigate(`/admin/dashboard`)
                console.log("Login Success:", res.data);
            }

        } catch (err) {
            const error = err as AxiosError;

            if (error.response?.status === 401) {
                setError("Invalid Credentials");
            }

            console.error("Login error:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (formData) {
            setError('')
        }
    }, [formData])

    return (
        <div className="h-screen w-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gray-100 w-[26rem] flex flex-col items-center p-4 rounded-lg font-poppins">
                    <h1 className="text-lg mb-4 text-gray-800">Welcome Admin</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col min-w-[22rem] space-y-3">
                        <input
                            type="text"
                            maxLength={20}
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            placeholder="Enter Username"
                            className="text-sm py-3 px-4 rounded bg-white outline-none"
                            required
                        />
                        <input
                            type="password"
                            maxLength={20}
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder="Enter Password"
                            className="text-sm py-3 px-4 rounded bg-white outline-none"
                            required
                        />
                        {error &&
                            <span className="text-red-500 text-center text-sm">{error}</span>
                        }
                        <button
                            type="submit"
                            className="bg-darkGreen text-white py-2.5 px-4 rounded"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
