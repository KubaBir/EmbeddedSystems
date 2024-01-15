import { useState, useEffect } from 'react';
import settings from '../settings.json';
import moment from 'moment';

export default function Passkeys() {
    const [keys, setKeys] = useState();

    useEffect(() => {
        async function fetchLogs() {
            const res = await fetch(`${settings.BACKEND_URL}/key`, {
                method: 'GET',
            });
            const data = await res.json();
            console.log(data.keys);
            setKeys(data.keys);
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
                    <tr className="border-t last:border-b">
                        <td>{key.id}</td>
                        <td>{key.owner_name} </td>
                        <td>{moment(key.last_used).format('h:mm DD.MM.YYYY')}</td>
                    </tr>
                );
            })}
        </table>
    );
}
