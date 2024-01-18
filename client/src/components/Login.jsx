import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import settings from '../settings.json';

export default function Login() {
    const [pass, setPass] = useState();
    const [name, setName] = useState();
    const warn = (msg) => toast.warn(msg);

    async function checkCredentials(e) {
        e.preventDefault();
        const res = await fetch(`${settings.BACKEND_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: name, password: pass }),
        });
        const data = await res.json();
        if (data.status) {
            localStorage.setItem('authenticated', true);
            window.location.reload();
        } else warn('Could not authenticate with the provided credentials');
    }

    return (
        <div>
            <form action="POST" onSubmit={checkCredentials}>
                <div>
                    <label htmlFor="">Username:</label>
                    <input
                        required={true}
                        className="my-1 px-2 py-1 w-full rounded-md bg-gray-200 focus-visible:outline-none"
                        type="text"
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                    />
                </div>
                <div>
                    <label htmlFor="">Password:</label>
                    <input
                        required={true}
                        className="my-1 px-2 py-1 w-full rounded-md bg-gray-200 focus-visible:outline-none"
                        type="password"
                        onChange={(event) => setPass(event.target.value)}
                        value={pass}
                    />
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="bg-slate-200 my-1 py-1 p-2 rounded-md text-lg mt-4">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
