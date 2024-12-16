import { useState } from "react";
import useAuth from "./useAuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const login = async (email, password) => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/user/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });
            const json = await response.json();
            console.log("Response from server:", json);
            
            if (!response.ok) {
                setError(json.error || "An error occurred during login.");
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: json.error || "Something went wrong. Please try again later.",
                    showConfirmButton: true,
                });
                return null;
            }
            
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            return json;
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again later.");
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Something went wrong. Please try again later.",
                showConfirmButton: true,
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = async (userData) => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/user/googleLogin", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            
            const json = await response.json();
            console.log("Google login response from server:", json);
            
            if (!response.ok) {
                throw new Error(json.error || "An error occurred during Google login.");
            }
            
            // Store user data and token
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            
            // Handle navigation based on role
            if (json?.user?.role === 'school-owner') {
                navigate('/dashboard');
            } else if (json?.user?.role === 'teacher') {
                navigate('/teacherDashboard');
            } else {
                navigate('/');
            }
            
            return true;
        } catch (err) {
            console.error("Google login error:", err);
            setError(err.message || "Something went wrong with Google login.");
            Swal.fire({
                position: "center",
                icon: "error",
                title: err.message || "Something went wrong with Google login. Please try again later.",
                showConfirmButton: true,
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, googleLogin, error, isLoading };
};