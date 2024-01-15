import { useState, useEffect } from 'react';
import settings from '../settings.json';
import moment from 'moment';

export default function Requests() {
    const [keys, setKeys] = useState();

    useEffect(() => {
        async function fetchLogs() {
            const res = await fetch(`${settings.BACKEND_URL}/key/pending`, {
                method: 'GET',
            });
            const data = await res.json();
            console.log(data.pending);
            setKeys(data.pending);
        }
        fetchLogs();
    }, []);

    if (!keys) return;
    return (
        <table className="w-full">
            <tr>
                <th className="text-start">Key ID</th>
                <th className="text-start">Owner name</th>
                <th className="text-start">Last used</th>
            </tr>

            {keys.map((key) => {
                return (
                    <tr>
                        <td>{key.id}</td>
                        <td>{key.owner_name} </td>
                        <td>{moment(key.last_used).format('h:mm DD.MM.YYYY')}</td>
                    </tr>
                );
            })}
        </table>
    );
}
