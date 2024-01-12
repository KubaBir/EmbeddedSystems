export default function Home() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-center">
                <button className="rounded-lg bg-teal-400 px-4 py-2">Logs</button>
            </div>
            <div className="flex justify-center">
                <button className="rounded-lg bg-teal-400 px-4 py-2">Authorization requests</button>
            </div>
            <div className="flex justify-center">
                <button className="rounded-lg bg-teal-400 px-4 py-2">Registered passkeys</button>
            </div>
        </div>
    );
}
