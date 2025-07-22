import React from "react";
import styles from "./ConfirmEmailError.module.css"
import {ArrowLeft, Mail, RefreshCw, XCircle} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConfirmEmailError:React.FC = () => {

    const navigate = useNavigate();

    return (
        <>
            <article>
                <title>Email Not Confirmed — Nazary</title>
            </article>
            <div className={styles.invalidTokenPage}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.errorSection}>
                            <div className={styles.iconWrapper}>
                                <XCircle className={styles.errorIcon} />
                            </div>
                            <h1 className={styles.title}>Invalid Token</h1>
                            <p className={styles.description}>
                                The confirmation link is invalid or has expired.
                                This may have happened for several reasons.
                            </p>
                        </div>

                        <div className={styles.reasons}>
                            <h2 className={styles.reasonsTitle}>Possible reasons:</h2>
                            <div className={styles.reasonsList}>
                                <div className={styles.reasonItem}>
                                    <div className={styles.reasonDot}></div>
                                    <div>
                                        <div className={styles.reasonLabel}>The link has expired</div>
                                        <div className={styles.reasonText}>Links are valid for only 24 hours</div>
                                    </div>
                                </div>
                                <div className={styles.reasonItem}>
                                    <div className={styles.reasonDot}></div>
                                    <div>
                                        <div className={styles.reasonLabel}>The link has already been used</div>
                                        <div className={styles.reasonText}>Each link can only be used once</div>
                                    </div>
                                </div>
                                <div className={styles.reasonItem}>
                                    <div className={styles.reasonDot}></div>
                                    <div>
                                        <div className={styles.reasonLabel}>The link is broken</div>
                                        <div className={styles.reasonText}>It might not have been copied correctly</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={`${styles.button} ${styles.buttonPrimary}`}
                                onClick={() => navigate('/resend-confirmation')}
                            >
                                <RefreshCw className={styles.icon} />
                                Request a new link
                            </button>
                            <button
                                className={`${styles.button} ${styles.buttonOutline}`}
                                onClick={() => navigate('/')}
                            >
                                <ArrowLeft className={styles.icon} />
                                Go to homepage
                            </button>
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.helpInfo}>
                                <Mail className={styles.helpIcon} />
                                <span>
            If the issue persists,
            <a href="#" className={styles.helpLink}> contact support</a>
          </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.illustration}>
                        <div className={styles.brokenChain}>
                            <div className={styles.chainLink}></div>
                            <div className={styles.brokenLink}>
                                <div className={styles.brokenPart1}></div>
                                <div className={styles.brokenPart2}></div>
                            </div>
                            <div className={styles.chainLink}></div>
                        </div>
                        <div className={styles.sparkles}>
                            <div className={styles.sparkle}></div>
                            <div className={styles.sparkle}></div>
                            <div className={styles.sparkle}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmEmailError