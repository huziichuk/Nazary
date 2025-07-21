import React, {useState} from "react";
import {Eye, EyeOff, Mail, Lock, User} from "lucide-react";
import styles from "./Auth.module.css";
import type {IRegisterDto} from "@/types/authTypes.ts";
import {useForm} from "react-hook-form";
import ValidationError from "@/components/ValidationError.tsx";
import {apiRegister} from "@/api/auth.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

const RegisterForm: React.FC = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const {register, handleSubmit, formState, watch} = useForm<IRegisterDto>({
        mode: "onChange"
    });

    const password = watch("password");

    const onSubmit = async (data: IRegisterDto) => {
        setError(null);
        try {
            await apiRegister(data);
            navigate("login")

        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status === 400) {
                    setError(Array.isArray(e.response.data.message) ? e.response.data.message[0] : e.response.data.message);
                }
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {error ? <p className={styles.apiError}>{error}</p> : null}
            <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                    Name
                </label>
                <div className={styles.inputWrapper}>
                    <User className={styles.inputIcon}/>
                    <input
                        type="text"
                        id="name"
                        className={styles.input}
                        placeholder="Enter your name"
                        {...register("name", {
                            setValueAs: (v:string):string => v.trim() || ""
                        })}
                    />
                </div>
                <ValidationError className={styles.error} error={formState.errors.name?.message}/>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                    Email
                </label>
                <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon}/>
                    <input
                        id="email"
                        className={styles.input}
                        placeholder="your@email.com"
                        {...register("email", {
                            required: "Email is required", pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            },
                            setValueAs: (v:string):string => v.trim() || ""
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
                        id="password"
                        className={styles.input}
                        placeholder="Enter password"
                        {...register("password", {
                            required: "Password is required",
                            validate: {
                                minLength: (value: string) => value.length >= 8 || "Password must be at least 8 characters",
                                maxLength: (value: string) => value.length <= 50 || "Password must not exceed 50 characters",
                                hasUpperCase: (value: string) =>
                                    /[A-Z]/.test(value) || "Password must contain an uppercase letter",
                                hasNumber: (value: string) =>
                                    /\d/.test(value) || "Password must contain a number",
                            },
                            setValueAs: (v:string):string => v.trim() || ""
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

            <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                    Confirm Password
                </label>
                <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon}/>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        className={styles.input}
                        placeholder="Repeat password"
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: {
                                passwordMatch: (value: string) => value === password || "Passwords must match",
                            },
                            setValueAs: (v:string):string => v.trim() || ""
                        })}
                    />
                    <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className={styles.icon}/>
                        ) : (
                            <Eye className={styles.icon}/>
                        )}
                    </button>
                </div>
                <ValidationError className={styles.error} error={formState.errors.confirmPassword?.message}/>
            </div>

            <button type="submit" className={styles.submitButton}>
                Register
            </button>
        </form>
    );
}

export default RegisterForm;