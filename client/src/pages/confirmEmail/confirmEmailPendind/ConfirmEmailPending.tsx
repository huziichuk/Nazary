import React from "react";
import styles from "./ConfirmEmailPending.module.css";
import {CheckCircle2, Clock, ExternalLink, Mail, RefreshCw} from "lucide-react";
import {NavLink} from "react-router-dom";

const ConfirmEmailPending: React.FC = () => {
    return (
        <>
            <article>
                <title>Confirm Your Email — Nazary</title>
            </article>
            <div className={styles.pendingPage}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.mainSection}>
                            <div className={styles.iconWrapper}>
                                <div className={styles.mailIconContainer}>
                                    <Mail className={styles.mailIcon}/>
                                    <div className={styles.clockBadge}>
                                        <Clock className={styles.clockIcon}/>
                                    </div>
                                </div>
                            </div>

                            <h1 className={styles.title}>Confirm your email</h1>
                            <p className={styles.description}>
                                To use Nazary, you need to confirm your email address.
                            </p>
                        </div>

                        <div className={styles.instructionsCard}>
                            <h2 className={styles.instructionsTitle}>What to do next:</h2>
                            <div className={styles.stepsList}>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>1</div>
                                    <div className={styles.stepContent}>
                                        <div className={styles.stepLabel}>Open your email</div>
                                        <div className={styles.stepText}>
                                            Check your "Inbox" or "Spam" folder
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>2</div>
                                    <div className={styles.stepContent}>
                                        <div className={styles.stepLabel}>Find the email from Nazary</div>
                                        <div className={styles.stepText}>
                                            Subject: "Confirm your registration"
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>3</div>
                                    <div className={styles.stepContent}>
                                        <div className={styles.stepLabel}>Click the link</div>
                                        <div className={styles.stepText}>
                                            Click the confirmation button in the email
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.quickActions}>
                            <a
                                className={`${styles.button} ${styles.buttonPrimary}`}
                                href={"https://mail.google.com/"}
                                target={"_blank"}
                            >
                                <Mail className={styles.icon}/>
                                Open Gmail
                                <ExternalLink className={styles.iconSmall}/>
                            </a>
                            <NavLink
                                className={`${styles.button} ${styles.buttonOutline}`}
                                to={"/resend-confirmation"}
                            >
                                <RefreshCw className={styles.icon}/>
                                Resend confirmation
                            </NavLink>
                        </div>

                        <div className={styles.helpSection}>
                            <div className={styles.helpCard}>
                                <CheckCircle2 className={styles.helpIcon}/>
                                <div className={styles.helpContent}>
                                    <div className={styles.helpTitle}>Didn't receive the email?</div>
                                    <div className={styles.helpText}>
                                        • Check your "Spam" or "Promotions" folder<br/>
                                        • Make sure the email address is correct<br/>
                                        • Email delivery may take up to 5 minutes
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.illustration}>
                        <div className={styles.emailAnimation}>
                            <div className={styles.envelope}>
                                <div className={styles.envelopeFlap}></div>
                                <div className={styles.envelopeBody}></div>
                                <Mail className={styles.envelopeIcon}/>
                            </div>
                            <div className={styles.floatingDots}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmEmailPending;