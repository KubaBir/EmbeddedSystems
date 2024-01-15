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
            <tr>
                <th className="text-start">Date</th>
                <th className="text-start">Tag ID</th>
                <th className="text-start">Log ID</th>
            </tr>

            {logs.map((log) => {
                return (
                    <tr className="border-t last:border-b">
                        <td>{moment(log.timestamp).format('h:mm DD.MM.YYYY')}</td>
                        <td>{log.tag_id}</td>
                        <td>{log.id.substring(0, 10)} </td>
                    </tr>
                );
            })}
        </table>
    );
}
