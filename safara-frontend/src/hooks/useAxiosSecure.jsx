import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000'
})
const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();
  

    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
         const token  = localStorage.getItem("access-token")
         config.headers.authorization = `Bearer ${token}`;
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });

      axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },  async (error) => {
        const status = error.response.status;
  
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }
    }
    )
    return axiosSecure
};

export default useAxiosSecure;