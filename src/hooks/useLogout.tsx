import { api } from "@/config";
import endPoints from "@/config/endpoints";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate();
    const dispath = useDispatch();
    
    return async () => {
        try {
            await api.request({
                url: endPoints.auth.logout.url,
                method: endPoints.auth.logout.method,
            })
            dispath(logoutAction());
            navigate("/login", { replace: true });
        } catch (error) {
            console.log("error during logout", error);
        }
    }
}