import React from "react";
import styles from "@/pages/home/Home.module.css"
import {NavLink} from "react-router-dom";
import {Code, FileText, Github, Globe, Search, Shield, Tag, User} from "lucide-react";
import logo from "@/assets/nazary-white.png"

const Home: React.FC = () => {
    return (
        <>
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={`${styles.textCenter} ${styles.spaceY8}`}>
                        <div className={styles.spaceY4}>
                            <div className={styles.badge}>
                                <Github className={`${styles.iconSmall} ${styles.iconMr}`} />
                                Open Source
                            </div>
                            <h1 className={styles.heroTitle}>
                                A web notebook for{" "}
                                <span className={styles.gradientText}>your ideas</span>
                            </h1>
                            <p className={styles.heroDescription}>
                                Create, organize, and store notes in your browser using a modern
                                web application. No limits, no subscriptions — just creative freedom.
                            </p>
                        </div>

                        <div className={styles.buttonGroup}>
                            <NavLink
                                className={`${styles.button} ${styles.buttonPrimary}`}
                                to={"/login"}
                            >
                                <Globe className={`${styles.icon} ${styles.iconMr}`} />
                                Open in browser
                            </NavLink>
                            <a href="https://github.com/huziichuk/Nazary">
                                <button className={`${styles.button} ${styles.buttonOutline}`}>
                                    <Github className={`${styles.icon} ${styles.iconMr}`} />
                                    Source Code
                                </button>
                            </a>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <User className={styles.icon} />
                                <span>Built by a solo developer</span>
                            </div>
                            <div className={styles.statItem}>
                                <Globe className={styles.icon} />
                                <span>Web Application</span>
                            </div>
                            <div className={styles.statItem}>
                                <Shield className={styles.icon} />
                                <span>MIT License</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className={`${styles.section} ${styles.sectionCard}`}>
                <div className={styles.container}>
                    <div
                        className={`${styles.textCenter} ${styles.spaceY4} ${styles.sectionHeader}`}
                    >
                        <h2 className={styles.sectionTitle}>Everything you need for note-taking</h2>
                        <p className={styles.sectionDescription}>
                            A simple yet powerful set of tools to organize your thoughts
                        </p>
                    </div>

                    <div className={styles.featuresGrid}>
                        <div className={`${styles.card} ${styles.cardHover}`}>
                            <div className={styles.cardHeader}>
                                <FileText className={styles.cardIcon} />
                                <h3 className={styles.cardTitle}>Markdown Support</h3>
                                <p className={styles.cardDescription}>
                                    Write notes with full Markdown syntax support
                                </p>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.cardHover}`}>
                            <div className={styles.cardHeader}>
                                <Search className={styles.cardIcon} />
                                <h3 className={styles.cardTitle}>Fast Search</h3>
                                <p className={styles.cardDescription}>
                                    Instantly find notes by content and tags
                                </p>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.cardHover}`}>
                            <div className={styles.cardHeader}>
                                <Tag className={styles.cardIcon} />
                                <h3 className={styles.cardTitle}>Tagging System</h3>
                                <p className={styles.cardDescription}>
                                    Organize your notes using a flexible tagging system
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className={styles.section}>
                <div className={styles.containerMd}>
                    <div className={`${styles.textCenter} ${styles.spaceY8}`}>
                        <div className={styles.spaceY4}>
                            <h2 className={styles.sectionTitle}>About the Project</h2>
                            <p className={styles.sectionDescription}>
                                Nazary is a personal project built to showcase the potential of modern
                                web technologies in creating useful tools for note-taking.
                            </p>
                        </div>

                        <div className={styles.aboutGrid}>
                            <div className={`${styles.card} ${styles.textLeft}`}>
                                <div className={styles.cardHeader}>
                                    <User className={styles.cardIcon} />
                                    <h3 className={styles.cardTitle}>Solo Development</h3>
                                </div>
                                <div className={styles.cardContent}>
                                    <p className={styles.cardDescription}>
                                        The project is built and maintained by a single developer,
                                        allowing a consistent vision and quick implementation of new features.
                                    </p>
                                </div>
                            </div>

                            <div className={`${styles.card} ${styles.textLeft}`}>
                                <div className={styles.cardHeader}>
                                    <Code className={styles.cardIcon} />
                                    <h3 className={styles.cardTitle}>Modern Technologies</h3>
                                </div>
                                <div className={styles.cardContent}>
                                    <p className={styles.cardDescription}>
                                        Built using the latest web technologies for a fast and responsive
                                        interface with excellent user experience.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.buttonGroup}>
                            <a href="https://github.com/huziichuk/Nazary">
                                <button className={`${styles.button} ${styles.buttonOutline}`}>
                                    <Github className={`${styles.icon} ${styles.iconMr}`} />
                                    View on GitHub
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionCard}`}>
                <div className={`${styles.containerMd} ${styles.textCenter}`}>
                    <div className={styles.spaceY8}>
                        <div className={styles.spaceY4}>
                            <h2 className={styles.sectionTitle}>Start using it today</h2>
                            <p className={styles.sectionDescription}>
                                Open Nazary in your browser and start taking notes right away
                            </p>
                        </div>

                        <div className={styles.heroLogo}>
                            <img src={logo} alt="Nazary Logo" className={styles.heroLogoImage} />
                        </div>

                        <NavLink
                            className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge}`}
                            to={"/login"}
                        >
                            <Globe className={`${styles.icon} ${styles.iconMr}`} />
                            Launch Nazary
                        </NavLink>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home