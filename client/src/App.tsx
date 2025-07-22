import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "@/pages/home/Home.tsx";
import MainLayout from "@/layouts/MainLayout/MainLayout.tsx";
import NotFound from "@/pages/notFound/NotFound.tsx";
import Auth from "@/pages/auth/Auth.tsx";
import Loading from "@/pages/loading/Loading.tsx";
import ConfirmEmail from "@/pages/confirmEmail/ConfirmEmail.tsx";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route element={<MainLayout/>}>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/auth"} element={<Auth/>}>
                            <Route path="login" element={<Auth/>}/>
                            <Route path="register" element={<Auth/>}/>
                        </Route>
                        <Route path="/verify-email" element={<ConfirmEmail/>}/>
                    </Route>
                    <Route path={"/loading"} element={<Loading/>}/>
                    <Route element={<MainLayout/>}>
                        <Route path="*" element={<NotFound/>} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
