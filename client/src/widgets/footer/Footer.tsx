import React from "react";
import styles from "@/widgets/footer/Footer.module.css"
import logo from "@/assets/nazary-white.png"
import { Github, Heart, User } from "lucide-react";

const Footer:React.FC = () => {

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brandSection}>
                        <div className={styles.brand}>
                            <img src={logo} alt="Nazary Logo" className={styles.logoImage} />
                            <span className={styles.logoText}>Nazary</span>
                        </div>
                        <p className={styles.description}>
                            A modern web notebook for notes. Created with love for web technologies and user convenience.
                        </p>
                        <div className={styles.socialLinks}>
                            <button className={styles.button}>
                                <Github className={styles.icon} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.linkSection}>
                        <h3 className={styles.sectionTitle}>Product</h3>
                        <ul className={styles.linkList}>
                            <li><a href="#features" className={styles.linkItem}>Features</a></li>
                            <li><a href="#about" className={styles.linkItem}>About</a></li>
                            <li><a href="#" className={styles.linkItem}>Updates</a></li>
                            <li><a href="#" className={styles.linkItem}>Roadmap</a></li>
                        </ul>
                    </div>

                    <div className={styles.linkSection}>
                        <h3 className={styles.sectionTitle}>For Developers</h3>
                        <ul className={styles.linkList}>
                            <li><a href="#" className={styles.linkItem}>Documentation</a></li>
                            <li><a href="#" className={styles.linkItem}>Source Code</a></li>
                            <li><a href="#" className={styles.linkItem}>Bugs & Suggestions</a></li>
                            <li><a href="#" className={styles.linkItem}>Contact</a></li>
                        </ul>
                    </div>

                    <div className={styles.linkSection}>
                        <h3 className={styles.sectionTitle}>Support</h3>
                        <ul className={styles.linkList}>
                            <li><a href="#" className={styles.linkItem}>Help</a></li>
                            <li><a href="#" className={styles.linkItem}>FAQ</a></li>
                            <li><a href="#" className={styles.linkItem}>Feedback</a></li>
                            <li><a href="#" className={styles.linkItem}>Status</a></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.divider}>
                    <div className={styles.footerBottom}>
                        <div className={styles.madeWith}>
                            <span>Made with</span>
                            <Heart className={styles.heartIcon} />
                            <span>by a solo developer</span>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <User className={styles.iconSmall} />
                                <span>Personal project</span>
                            </div>
                            <div className={styles.statItem}>
                                <Github className={styles.iconSmall} />
                                <span>MIT License</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer