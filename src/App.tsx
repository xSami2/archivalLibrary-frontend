import {useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputOtp} from 'primereact/inputotp';
import {Password} from 'primereact/password';

import {Card} from 'primereact/card';

function App() {
    const [count, setCount] = useState(0);
    const [token, setToken] = useState(0);
    const [value, setValue] = useState('');


    return (

        <div className="flex items-center justify-center min-h-screen w-full">

                <Card title="Login">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="username">Username</label>
                        <InputText id="username" aria-describedby="username-help"/>

                        <label htmlFor="password">Password</label>
                        <Password value={value} onChange={(e) => setValue(e.target.value)} toggleMask feedback={false}/>

                        <Button className="mt-4 w-full" label="Submit"/>
                        <p className="mt-4">Don't have An account? Register</p>

                    </div>


                </Card>


        </div>


    );
}

export default App;
