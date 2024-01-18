import Logs from './components/Logs';
import Passkeys from './components/Passkeys';
import Requests from './components/Requests';
import Login from './components/Login';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import settings from './settings.json';

const components = {
    logs: { el: <Logs />, title: 'Logs' },
    passkeys: { el: <Passkeys />, title: 'Passkeys' },
    requests: { el: <Requests />, title: 'Requests' },
    login: { el: <Login />, title: 'Login' },
};
function App() {
    const [activePage, setActivePage] = useState();
    const [showModal, setShowModal] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [newPassword1, setNewPassword1] = useState();
    const [newPassword2, setNewPassword2] = useState();

    const notify = (msg) => toast(msg);
    const warn = (msg) => toast.warn(msg);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('authenticated');
        if (!isAuthenticated) setActivePage(components.login);
    }, []);

    async function handleChangePassword() {
        if (newPassword1 !== newPassword2) {
            warn('New passwords must match');
            return;
        }
        const res = await fetch(`${settings.BACKEND_URL}/auth/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password, newPassword: newPassword1 }),
        });
        const data = await res.json();

        setUsername('');
        setPassword('');
        setNewPassword1('');
        setNewPassword2('');
        setShowModal(false);
        if (data.status) notify('Password changed');
        warn('Could not authenticate with provided credentials');
    }

    return (
        <>
            <div className="relative sm:mx-auto max-w-xl my-8 p-1 sm:p-6 border rounded-lg bg-gray-100 shadow-lg h-[50vh]">
                <h1 className="text-center text-2xl lg:text-3xl mb-8">
                    {activePage ? activePage.title : 'Advanced Security System'}
                </h1>
                {activePage && activePage.title !== 'Login' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4">
                        <button className="rounded-lg bg-gray-300 px-4 py-2" onClick={() => setActivePage()}>
                            Home
                        </button>
                    </div>
                )}
                {!activePage && (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-center">
                            <button
                                className="rounded-lg bg-slate-400 shadow-lg px-4 py-2"
                                onClick={() => setActivePage(components.logs)}
                            >
                                Logs
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="rounded-lg bg-slate-400 shadow-lg px-4 py-2"
                                onClick={() => setActivePage(components.requests)}
                            >
                                Authorization requests
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="rounded-lg bg-slate-400 shadow-lg px-4 py-2"
                                onClick={() => setActivePage(components.passkeys)}
                            >
                                Registered passkeys
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="rounded-lg bg-slate-400 shadow-lg px-4 py-2"
                                onClick={() => {
                                    localStorage.removeItem('authenticated');
                                    window.location.reload();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="rounded-lg bg-slate-400 shadow-lg px-4 py-2"
                                onClick={() => {
                                    setShowModal(true);
                                }}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                )}
                <div className="h-[13rem] overflow-y-auto">{activePage?.el}</div>
            </div>
            <ToastContainer hideProgressBar={true} />
            {showModal && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 rounded-lg p-4 shadow-lg w-[90%] md:w-[50%] lg:w-[40%]">
                    <label>Username</label>
                    <input
                        className="my-1 px-2 py-1 w-full rounded-md bg-gray-200 focus-visible:outline-none"
                        type="text"
                        onChange={(event) => setUsername(event.target.value)}
                        value={username}
                    />
                    <label>Old Password</label>
                    <input
                        className="my-1 px-2 py-1 w-full rounded-md bg-gray-200 focus-visible:outline-none"
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                    />
                    <label>New Password</label>
                    <input
                        className="my-1 px-2 py-1 w-full rounded-md bg-gray-200 focus-visible:outline-none"
                        type="password"
                        onChange={(event) => setNewPassword1(event.target.value)}
                        value={newPassword1}
                    />
                    <label>Confirm New Password</label>
                    <input
                        className="my-1 px-2 py-1 w-full rounded-md bg-gray-200 focus-visible:outline-none"
                        type="password"
                        onChange={(event) => setNewPassword2(event.target.value)}
                        value={newPassword2}
                    />

                    <div className="flex justify-around mt-4">
                        <button
                            className="bg-green-400 my-1 py-1 p-2 rounded-md"
                            onClick={handleChangePassword}
                        >
                            Submit
                        </button>
                        <button
                            className="bg-red-400 my-1 py-1 p-2 rounded-md"
                            onClick={() => {
                                setShowModal(false);
                                setUsername('');
                                setPassword('');
                                setNewPassword1('');
                                setNewPassword2('');
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
