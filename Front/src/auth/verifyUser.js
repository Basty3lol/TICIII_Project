import axios from "axios"

const host = process.env.REACT_APP_HOST_BACKEND

const VerifyUser =  () => {
    if(localStorage.getItem("token")){
        try{
            const response = axios.post((host+"/api/login/verifyToken"),{},{
                headers: {'x-access-token': localStorage.getItem("token")}
            });
            //console.log(response)
            return true
        }
        catch(err){
            //console.log("Sesion caducada o no autorizado")
            localStorage.removeItem("token")
            return false;   
        }
    }
    else{
        //console.log("No hay token")
        return false;
    }  
}
export default VerifyUser