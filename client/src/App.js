import Logs from './components/Logs';
import Passkeys from './components/Passkeys';
import Requests from './components/Requests';
import { useState } from 'react';

function App() {
    const components = {
        logs: { el: <Logs />, title: 'Logs' },
        passkeys: { el: <Passkeys />, title: 'Passkeys' },
        requests: { el: <Requests />, title: 'Requests' },
    };
    const [activePage, setActivePage] = useState();

    return (
        <div className="relative sm:mx-auto max-w-xl my-8 p-1 sm:p-6 border rounded-lg bg-gray-100 shadow-lg h-[50vh]">
            <h1 className="text-center text-2xl lg:text-3xl mb-8">
                {activePage ? activePage.title : 'Advanced Security System (ASS)'}
            </h1>
            {activePage ? (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4">
                    <button className="rounded-lg bg-gray-300 px-4 py-2" onClick={() => setActivePage()}>
                        Home
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center">
                        <button
                            className="rounded-lg bg-teal-400 px-4 py-2"
                            onClick={() => setActivePage(components.logs)}
                        >
                            Logs
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="rounded-lg bg-teal-400 px-4 py-2"
                            onClick={() => setActivePage(components.requests)}
                        >
                            Authorization requests
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="rounded-lg bg-teal-400 px-4 py-2"
                            onClick={() => setActivePage(components.passkeys)}
                        >
                            Registered passkeys
                        </button>
                    </div>
                </div>
            )}
            <div className="h-[13rem] overflow-y-scroll">{activePage?.el}</div>
        </div>
    );
}

export default App;
