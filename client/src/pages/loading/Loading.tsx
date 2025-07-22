import {Loader2} from "lucide-react";
import styles from "./LoadingPage.module.css";
import logo from "@/assets/nazary-white.png";
import React from "react";

interface LoadingPageProps {
    message?: string;
    subMessage?: string;
}

const Loading: React.FC<LoadingPageProps> = ({
                                                 message = "Loading...",
                                                 subMessage = "Please, wait"
                                             }: LoadingPageProps) => {
    return (
        <>
            <article>
                <title>Loading... — Nazary</title>
            </article>
            <div className={styles.loadingPage}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.logoSection}>
                            <div className={styles.logoWrapper}>
                                <img src={logo} alt="Nazary Logo" className={styles.logo}/>
                                <div className={styles.logoGlow}></div>
                            </div>
                            <span className={styles.logoText}>Nazary</span>
                        </div>

                        <div className={styles.loadingSection}>
                            <div className={styles.spinnerWrapper}>
                                <div className={styles.spinner}>
                                    <div className={styles.spinnerRing}></div>
                                    <div className={styles.spinnerRing}></div>
                                    <div className={styles.spinnerRing}></div>
                                </div>
                                <Loader2 className={styles.loaderIcon}/>
                            </div>

                            <div className={styles.textSection}>
                                <h1 className={styles.message}>{message}</h1>
                                <p className={styles.subMessage}>{subMessage}</p>
                            </div>

                            <div className={styles.progressBar}>
                                <div className={styles.progressFill}></div>
                            </div>
                        </div>

                        <div className={styles.tips}>
                            <div className={styles.tipItem}>
                                <div className={styles.tipDot}></div>
                                <span>Preparing your workspace</span>
                            </div>
                            <div className={styles.tipItem}>
                                <div className={styles.tipDot}></div>
                                <span>Loading the latest updates</span>
                            </div>
                            <div className={styles.tipItem}>
                                <div className={styles.tipDot}></div>
                                <span>Configuring personalization</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.background}>
                        <div className={styles.floatingElement}></div>
                        <div className={styles.floatingElement}></div>
                        <div className={styles.floatingElement}></div>
                        <div className={styles.floatingElement}></div>
                        <div className={styles.floatingElement}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Loading;