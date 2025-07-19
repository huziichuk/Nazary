import React from "react";
import {Outlet} from "react-router-dom";
import MainHeader from "@/widgets/mainHeader/MainHeader.tsx";
import Footer from "@/widgets/footer/Footer.tsx";

const MainLayout: React.FC = () => {
    return (
        <>
            <MainHeader/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}

export default MainLayout