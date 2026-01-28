import { api } from "@/config";
import endPoints from "@/config/endpoints";
import { store } from "@/store";
import { authCheckedAuthenticated, authCheckedUnauthenticated } from "@/store/slices/authSlice";


export default async function authBootstrap():Promise<Boolean> {
    try {
        const response = await api.request({
            url: endPoints.auth.me.url,
            method: endPoints.auth.me.method
        });
        const user = response.data.data.user;
        store.dispatch(authCheckedAuthenticated({user}));
        return true
    } catch (error) {
        console.error('Authentication check failed:', error);
        store.dispatch(authCheckedUnauthenticated());
        return false;
    }
}
