import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/GlobalContext";

const HomePage = () => {
    const navigate = useNavigate()
    const {user} = useContext(AppContext)

    useEffect(() =>{
        if(user){
            navigate('/dashboard')
        }
    }, [user])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">
                    Welcome to Form Builder
                </h1>
                <p className="text-gray-600 mb-10">
                    Create and manage dynamic forms easily — no coding required.
                </p>

                <div className="flex gap-6 justify-center">
                    <button onClick={() => {navigate('/signUp')}} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition">
                        Sign Up
                    </button>
                    <button onClick={() => {navigate('/login')}} className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-200 transition">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
