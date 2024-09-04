import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {useState} from "react";
import axios, {AxiosResponse} from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';


export default function RegisterPage() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();


    async function registerUser(event: any) {
        event.preventDefault();
        try {
            const responses = await axios.post("http://localhost:9091/api/v1/auth/register", user)
            const token = responses.data.token
            sessionStorage.setItem("token", JSON.stringify(token))
            toast.success('Account created successfully!', {
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
                navigate('/');
            }, 3000)


        } catch (error) {
            toast.error('User Already exists', {
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

            <Card title="Register">

                <form onSubmit={registerUser} className="flex flex-col gap-2">
                    <label htmlFor="username">Username</label>
                    <InputText required value={user.username}
                               onChange={(e) => setUser({...user, username: e.target.value})}
                               id="username" minLength={5} aria-describedby="username-help"/>


                    <label htmlFor="password">Password</label>
                    <Password required min="5" minLength={5} value={user.password} onChange={(e) => setUser({
                        ...user,
                        password: e.target.value
                    })} toggleMask feedback={false}/>

                    <Button className="mt-4 w-full" type="submit" label="Register"/>


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
