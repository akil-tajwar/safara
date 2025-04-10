
import axios from "axios"
const axiosPublic = axios.create({
  
    baseURL:  import.meta.env.VITE_SAFARA_baseUrl;
      
})
const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;