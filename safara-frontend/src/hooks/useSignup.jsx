import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
export const useSignup=()=>{
    const navigate = useNavigate();
    const [error,setError]=useState(null);
    const {dispatch}=useAuth();

    const signup=async(firstname, lastname, email, phone, role, password)=>{
        setError(null);

        console.log("AP=>",firstname, lastname, email, phone, role, password)

        const response=await fetch("http://localhost:4000/api/user/signup",{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({firstname, lastname, email, phone, role, password})
        })

        const json=await response.json();

        if(!response.ok){
            return (json.error);
            setError(json.error);
        }
        if(response.ok){
            localStorage.setItem('user',JSON.stringify(json));
        }
    }

    return {signup,error};
}