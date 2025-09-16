import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "../services/axios";

const SignupForm = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOtp  , setIsSendingOTP] = useState(false)
    const [isSubmitting , setIsSubmitting] = useState(false)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();

    const handleSendOtp = async () => {
        setOtpSent(true)
        setIsSendingOTP(true)
        const email = watch("email");
        if (!email) {
            setError("email", { type: "manual", message: "Please enter your email first." });
            return;
        }
        clearErrors("email");
        const obj = {
            email
        }
        try {
            const resp = await axios.post('/user/send-otp', obj)
            if (resp.status === 200) {
                if (resp.data.status === 0) toast.error("Error in sending OTP")
                if (resp.data.status === 2) toast.error("server error")
                if (resp.data.status === 1) {
                    toast.success("OTP sent successfully")
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("server error")
        }
        setIsSendingOTP(false)
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        console.log(data)
        try {
            const resp = await axios.post('/user/register', data)
            if (resp.status === 200) {
                if (resp.data.status === 0) toast.error("Error in registering User")
                if (resp.data.status === 2) toast.error("Invalid OTP")
                if (resp.data.status === 1) {
                    toast.success("User registered succesfully")
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("server error")
        }
        setIsSubmitting(false)
    };

    return (
        <div
            className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Card */}
            <div className="relative bg-white p-8 rounded-xl w-[380px] shadow-xl z-10">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Sign Up
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Name:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email + OTP button */}
                    <div className="flex mb-4">
                        <div className="flex-2 mr-2 w-2/3">
                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                Email:
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
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
                        <div className="flex-1 flex items-end">
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp}
                                className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-semibold text-sm shadow-md hover:opacity-90 transition"
                            >
                                {isSendingOtp ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                    </div>

                    {/* OTP Field */}
                    {otpSent && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                Enter OTP:
                            </label>
                            <input
                                type="text"
                                placeholder="Enter the OTP"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register("otp", { required: "OTP is required" })}
                            />
                            {errors.otp && (
                                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
                            )}
                        </div>
                    )}

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            placeholder="Create a password"
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

                    {/* Submit */}
                    <button
                    disabled={isSubmitting}
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold text-lg shadow-md hover:opacity-90 transition"
                    >
                        {isSubmitting ?"waiting...":"Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;