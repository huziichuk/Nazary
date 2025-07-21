import {useState} from "react";
import {Eye, EyeOff, Mail, Lock} from "lucide-react";
import styles from "./Auth.module.css";
import {NavLink, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import type {ILoginDto} from "@/types/authTypes.ts";
import ValidationError from "@/components/ValidationError.tsx";
import {apiLogin} from "@/api/auth.ts";
import {AxiosError} from "axios";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const {register, handleSubmit, formState} = useForm<ILoginDto>({
        mode: "onChange"
    })

    const onSubmit = async (data: ILoginDto) => {
        setError(null);
        try {
            await apiLogin(data);
            navigate("/dashboard");
        } catch (e) {
            if (e instanceof AxiosError) {
                setError(Array.isArray(e.response?.data.message) ? e.response?.data.message[0] : e.response?.data.message);
                return
            }
            setError("Some error occurred, please try again later.");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {error ? <p className={styles.apiError}>{error}</p> : null}
            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                    Email
                </label>
                <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon}/>
                    <input
                        className={styles.input}
                        placeholder="your@email.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            },
                            setValueAs: (v: string): string => v.trim() || ""
                        })}
                    />
                </div>
                <ValidationError className={styles.error} error={formState.errors.email?.message}/>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                    Password
                </label>
                <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon}/>
                    <input
                        type={showPassword ? "text" : "password"}
                        className={styles.input}
                        placeholder="Enter password"
                        {...register("password", {
                            required: "Password is required",
                            setValueAs: (v: string): string => v.trim() || ""
                        })}
                    />
                    <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className={styles.icon}/>
                        ) : (
                            <Eye className={styles.icon}/>
                        )}
                    </button>
                </div>
                <ValidationError className={styles.error} error={formState.errors.password?.message}/>
            </div>

            <div className={styles.forgotPassword}>
                <NavLink to="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                </NavLink>
            </div>

            <button type="submit" className={styles.submitButton}>
                Log In
            </button>
        </form>

    );
}

export default LoginForm;