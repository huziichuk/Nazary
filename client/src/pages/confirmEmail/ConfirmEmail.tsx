import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import ConfirmEmailPending from "@/pages/confirmEmail/confirmEmailPendind/ConfirmEmailPending.tsx";
import ConfirmEmailSuccess from "@/pages/confirmEmail/confirmEmailSuccess/ConfirmEmailSuccess.tsx";
import ConfirmEmailError from "@/pages/confirmEmail/confirmEmailError/ConfirmEmailError.tsx";
import {apiConfirmEmail} from "@/api/auth.ts";
import {useMutation} from "@tanstack/react-query";
import Loading from "@/pages/loading/Loading.tsx";

const ConfirmEmail:React.FC = () => {

    const [searchParams] = useSearchParams()
    const token = searchParams.get("token");

    const {
        mutate: verifyEmail,
        isPending,
        isSuccess,
        isError,
    } = useMutation({
        mutationFn: (token: string) => apiConfirmEmail(token),
    });


    useEffect(() => {
        if (token) {
            verifyEmail(token);
        }
    }, [token, verifyEmail]);




    if (!token) {
        return <ConfirmEmailPending/>
    }

    if (isSuccess) {
        return <ConfirmEmailSuccess/>;
    }

    if (isError) {
        return <ConfirmEmailError/>;
    }

    if (isPending){
        return <Loading/>
    }

    return (<ConfirmEmailError/>)
}

export default ConfirmEmail