import { useState, useEffect } from 'react';
import settings from '../settings.json';
import moment from 'moment';

export default function Logs() {
    const [logs, setLogs] = useState();

    useEffect(() => {
        async function fetchLogs() {
            const res = await fetch(`${settings.BACKEND_URL}/log/list`, {
                method: 'GET',
            });
            const data = await res.json();
            console.log(data.logs);
            setLogs(data.logs);
        }
        fetchLogs();
    }, []);

    if (!logs) return;
    return (
        <table className="w-full">
            <tr className="sticky top-0 bg-gray-100">
                <th className="text-start">Date</th>
                <th className="text-start">Tag ID</th>
                <th className="text-start">Log type</th>
            </tr>

            {logs.map((log) => {
                return (
                    <tr className="border-t last:border-b">
                        <td>{moment(log.timestamp).format('h:mm DD.MM.YYYY')}</td>
                        <td>{log.key_id}</td>
                        <td>{log.type} </td>
                    </tr>
                );
            })}
        </table>
    );
}
