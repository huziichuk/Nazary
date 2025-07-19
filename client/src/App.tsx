import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "@/pages/home/Home.tsx";
import MainLayout from "@/layouts/MainLayout/MainLayout.tsx";
import NotFound from "@/pages/notFound/NotFound.tsx";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route element={<MainLayout/>}>
                        <Route path={"/"} element={<Home/>}/>
                    </Route>

                    <Route element={<MainLayout/>}>
                        <Route path="*" element={<NotFound/>} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
