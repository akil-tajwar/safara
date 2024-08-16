import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({children}) => {
    const navigate= useNavigate()
    const location = useLocation()
    const {user,loading} = useAuth()

    if(loading)
    {
        return <span className="loading loading-ring loading-lg"></span>
    }
    if(user){
        return children
    }
    return <Navigate to="/login" state={location.pathname} replace></Navigate>
};

export default PrivateRoute;