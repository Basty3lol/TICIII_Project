import {Navigate, Outlet} from "react-router-dom"
import VerifyUser from "../auth/verifyUser"

export const ProtectedRoute = ({children}) => {
    if(VerifyUser()){
        //console.log("Verificado")
        return children ? children : <Outlet/>
    }
    else{
        return <Navigate to={"/"} />
    }
}