import Home from './components/Home';
import Logs from './components/Logs';
import Passkeys from './components/Passkeys';
import Requests from './components/Requests';
import { useState } from 'react';

function App() {
    const components = {
        home: <Home />,
        logs: <Logs />,
        passkeys: <Passkeys />,
        requests: <Requests />,
    };
    const [activePage, setActivePage] = useState(components.home);

    return (
        <div className="mx-4 sm:mx-auto max-w-xl my-8 p-6 border rounded-lg bg-gray-100 shadow-lg h-[50vh]">
            <h1 className="text-center text-2xl lg:text-3xl mb-8">Advanced Security System (ASS)</h1>
            {activePage}
        </div>
    );
}

export default App;
