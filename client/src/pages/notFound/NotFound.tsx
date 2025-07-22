import React from "react";
import styles from "@/pages/notFound/NotFound.module.css"
import logo from "@/assets/nazary-white.png"
import {ArrowLeft, Home, Search} from "lucide-react";
import {NavLink, useNavigate} from "react-router-dom";

const NotFound: React.FC = () => {

    const navigate = useNavigate();

    return (
        <>
            <article>
                <title>Not found — Nazary</title>
            </article>
            <div className={styles.notFoundPage}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <div className={styles.logoSection}>
                                <img src={logo} alt="Nazary Logo" className={styles.logo}/>
                                <span className={styles.logoText}>Nazary</span>
                            </div>
                        </div>

                        <div className={styles.errorSection}>
                            <div className={styles.errorCode}>404</div>
                            <h1 className={styles.title}>Page Not Found</h1>
                            <p className={styles.description}>
                                Unfortunately, the page you're looking for doesn't exist or has been moved.
                            </p>
                        </div>

                        <div className={styles.suggestions}>
                            <h2 className={styles.suggestionsTitle}>What you can do:</h2>
                            <div className={styles.suggestionsList}>
                                <div className={styles.suggestionItem}>
                                    <Search className={styles.suggestionIcon}/>
                                    <div>
                                        <div className={styles.suggestionLabel}>Check the URL</div>
                                        <div className={styles.suggestionText}>Make sure the address is typed
                                            correctly
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.suggestionItem}>
                                    <Home className={styles.suggestionIcon}/>
                                    <div>
                                        <div className={styles.suggestionLabel}>Go back to the homepage</div>
                                        <div className={styles.suggestionText}>Start from Nazary's main page</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <NavLink
                                className={`${styles.button} ${styles.buttonPrimary}`} to={"/"}
                            >
                                <Home className={styles.icon}/>
                                Go to Homepage
                            </NavLink>
                            <button
                                className={`${styles.button} ${styles.buttonOutline}`}
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className={styles.icon}/>
                                Go Back
                            </button>
                        </div>

                        <div className={styles.footer}>
                            <p className={styles.footerText}>
                                If the issue persists,
                                <a href="mailto:nazar.huziichuk@gmail.com" className={styles.contactLink}> contact the
                                    developer</a>
                            </p>
                        </div>
                    </div>

                    <div className={styles.illustration}>
                        <div className={styles.illustrationBackground}>
                            <div className={styles.floating404}>
                                <span>4</span>
                                <div className={styles.orbiting}>
                                    <img src={logo} alt="Nazary" className={styles.orbitingLogo}/>
                                </div>
                                <span>4</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFound;
