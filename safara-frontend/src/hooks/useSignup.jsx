import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "./useAuthContext";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuth();

    const signup = async (firstname, lastname, email, phone, role, prevRole, img, password) => {
        setError(null);
        try {
            const response = await fetch("http://localhost:4000/api/user/signup", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, phone, role, prevRole, img, password })
            });
            const json = await response.json();
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
                return true;
            }
            setError(json.error || "An error occurred during signup.");
            Swal.fire({
                position: "top-middle",
                icon: "error",
                title: json.error || "Something went wrong. Please try again later.",
                showConfirmButton: true,
            });
            return false;

        } catch (err) {
            Swal.fire({
                position: "top-middle",
                icon: "success",
                title: "Your account has been created",
                showConfirmButton: false,
                timer: 1500,
            });
            return false;
        }
    };

    return { signup, error };
};
