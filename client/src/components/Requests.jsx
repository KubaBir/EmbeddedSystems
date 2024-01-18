import { useState, useEffect } from 'react';
import settings from '../settings.json';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

export default function Requests() {
    const [keys, setKeys] = useState();
    const [showModal, setShowModal] = useState(false);
    const [targetKey, setTargetKey] = useState();
    const [name, setName] = useState();

    async function fetchLogs() {
        const res = await fetch(`${settings.BACKEND_URL}/key/pending`, {
            method: 'GET',
        });
        const data = await res.json();
        console.log(data.pending);
        setKeys(data.pending);
    }

    useEffect(() => {
        fetchLogs();
    }, []);

    async function removeKey(id) {
        await fetch(`${settings.BACKEND_URL}/key/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: id }),
        });
        setTimeout(() => {
            fetchLogs();
        }, 500);
    }

    function handleShowModal(id) {
        setTargetKey(id);
        setShowModal(true);
    }

    const notify = (msg) => toast(msg);

    async function handleAcceptKey() {
        await fetch(`${settings.BACKEND_URL}/key/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: targetKey,
                owner_name: name,
            }),
        });
        notify('Key authenticated');
        setTimeout(() => {
            fetchLogs();
        }, 500);
        setShowModal(false);
    }

    if (!keys) return;
    return (
        <>
            <table className="w-full">
                <tr>
                    <th className="text-start">Key ID</th>
                    <th className="text-start">Last used</th>
                </tr>

                {keys.map((key) => {
                    return (
                        <tr className="border-t last:border-b">
                            <td>{key.id}</td>
                            <td>{moment(key.last_used).format('h:mm DD.MM.YYYY')}</td>
                            <td>
                                <button
                                    className="bg-green-400 my-1 py-1 p-2 rounded-md"
                                    onClick={() => handleShowModal(key.id)}
                                >
                                    Accept
                                </button>
                            </td>
                            <td>
                                <button
                                    className="bg-red-400 my-1 py-1 p-2 rounded-md"
                                    onClick={() => {
                                        removeKey(key.id);
                                    }}
                                >
                                    Decline
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </table>
            {showModal && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 rounded-lg p-4 shadow-lg">
                    <label>Owner name:</label>
                    <input
                        className="my-1 px-2 py-1 w-full rounded-md bg-gray-200 focus-visible:outline-none"
                        type="text"
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                    />

                    <div className="flex justify-around mt-4">
                        <button className="bg-green-400 my-1 py-1 p-2 rounded-md" onClick={handleAcceptKey}>
                            Submit
                        </button>
                        <button
                            className="bg-red-400 my-1 py-1 p-2 rounded-md"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
