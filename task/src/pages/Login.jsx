import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "../services/axios";
import { AppContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const { user , fetchUser} = useContext(AppContext)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        if(user){
            navigate('/dashboard')
        }
    },[user])

    const onSubmit = async (data) => {
        try {
            const r = await axios.post('/user/login', data)
            if (r.status === 200) {
                if (r.data.status === 0) toast.error('Something went wrong')
                if (r.data.status === 7) toast.error('Data not sent')
                if (r.data.status === 3) toast.error('user not existed')
                if (r.data.status === 2) toast.warning('Invalid email or password')
                if (r.data.status === 1) {
                    toast.success('Login Succesfull')
                    for (let i = 0; i < 3; i++) {
                        if (!user) {
                            await fetchUser()
                        } else {
                            navigate('/')
                            break;
                        }
                    }
                }
                reset()
            }
        } catch (err) {
            console.log(err)
            toast.error("Server not running")
        }
    }

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Card */}
            <div className="relative bg-white p-8 rounded-xl w-96 shadow-xl z-10">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Login
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Enter a valid email",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold text-lg shadow-md hover:opacity-90 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;