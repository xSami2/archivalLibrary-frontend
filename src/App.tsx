import {useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputOtp} from 'primereact/inputotp';
import {Password} from 'primereact/password';
import {Outlet, Link, useNavigate} from "react-router-dom";


import {Card} from 'primereact/card';
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";

function App() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();


    async function loginUser(event: any) {
        event.preventDefault();
        try {
            const responses = await axios.post("http://localhost:9091/api/v1/auth/authenticate", user)
            const token = responses.data.token
            sessionStorage.setItem("token", JSON.stringify(token))
            localStorage.setItem("user", JSON.stringify(responses.data.userDTO))
            toast.success('Login  successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            setTimeout(() => {
                navigate('/documents');
            }, 3000)


        } catch (error) {
            toast.error('User Credentials Wrong', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }


    }

    return (

        <div className="flex items-center justify-center min-h-screen w-full">

            <Card title="Login">

                <form onSubmit={loginUser} className="flex flex-col gap-2">
                    <label htmlFor="username">Username</label>
                    <InputText required value={user.username}
                               onChange={(e) => setUser({...user, username: e.target.value})}
                               id="username" minLength={5} aria-describedby="username-help"/>


                    <label htmlFor="password">Password</label>
                    <Password required min="5" minLength={5} value={user.password} onChange={(e) => setUser({
                        ...user,
                        password: e.target.value
                    })} toggleMask feedback={false}/>

                    <Button className="mt-4 w-full" type="submit" label="Login"/>


                        <p> Don't have An account? <Link to="/register" className="text-blue-600"> Register</Link></p>


                </form>


            </Card>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                limit={1}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ToastContainer/>
        </div>


    );
}

export default App;
