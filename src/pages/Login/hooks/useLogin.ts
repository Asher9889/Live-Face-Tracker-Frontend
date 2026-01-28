import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login.api";
import loginSchema, { type TLoginSchema } from "../validations/login.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { authCheckedAuthenticated } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
export function useLogin(){
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { handleSubmit, formState, setValue, register} = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        },
        reValidateMode: "onChange",
        mode: "onChange"
    });


    const mutate = useMutation({
        mutationFn: (data: TLoginSchema) => login(data),
        mutationKey: ["login"],
        onSuccess: (data) => {
            dispatch(authCheckedAuthenticated({user: data.user}));
            navigate("/", { replace: true })
        }
    })

    function handleLogin(data: TLoginSchema){
        mutate.mutate(data);
    }

    return { mutate, handleLogin, handleSubmit, formState, setValue, register };
}