import { useState } from "react";
import useAuth from "./useAuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
  

export const useLogin = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate;
    const { dispatch } = useAuth();
    
  // Get the user's device information
    const userAgent = navigator.userAgent;
    const login = async (email, password) => {
        setError(null);
        try {
            const response = await fetch("http://localhost:4000/api/user/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password , deviceInfo: userAgent })
            });
            const json = await response.json();
            console.log("Response from server:", json);
            if (!response.ok) {
                setError(json.error || "An error occurred during login.");
                Swal.fire({
                    position: "top-middle",
                    icon: "error",
                    title: json.error || "Something went wrong. Please try again later.",
                    showConfirmButton: true,
                });
                return false;
            }
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            return true;

        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again later.");
            Swal.fire({
                position: "top-middle",
                icon: "error",
                title: "Something went wrong. Please try again later.",
                showConfirmButton: true,
            });
            return false;
        }
    };

    const googleLogin=async(firstname, lastname, email,role)=>{
        setError(null);
        const response=await fetch("http://localhost:4000/api/user/signup",{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({firstname, lastname, email,role})
        })
        const json=await response.json();
        if(!response.ok){
            return (json.error);
            setError(json.error);
        }
        if(response.ok){
            localStorage.setItem('user',JSON.stringify(json));

            dispatch({type:'LOGIN',payload:json})
            if(json?.user?.role === 'school-owner') {
                navigate('/dashboard')
            }
            else if(json?.user?.role === 'teacher') {
                navigate('/teacherDashboard')
            }

        }
    }

    return { login, googleLogin, error };
};
