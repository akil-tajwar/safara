import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "./useAuth";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuth();

    const signup = async (firstname, lastname, email, phone, role, password) => {
        setError(null); // Clear any previous errors

        try {
            const response = await fetch("http://localhost:4000/api/user/signup", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, phone, role, password })
            });

            const json = await response.json();

            // Handle responses with status code 2xx (success)
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(json));
                dispatch({ type: 'LOGIN', payload: json });
                Swal.fire({
                    position: "top-middle",
                    icon: "success",
                    title: "Your account has been created",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return true; // Indicate success
            }

            // Handle any other status codes as errors
            setError(json.error || "An error occurred during signup.");
            Swal.fire({
                position: "top-middle",
                icon: "error",
                title: json.error || "Something went wrong. Please try again later.",
                showConfirmButton: true,
            });
            return false; // Indicate failure

        } catch (err) {
            // Handle network or other unexpected errors
            // setError("Something went wrong. Please try again later.");
            Swal.fire({
                position: "top-middle",
                icon: "success",
                title: "Your account has been created",
                showConfirmButton: false,
                timer: 1500,
            });
            return false; // Indicate failure
        }
    };

    return { signup, error };
};
