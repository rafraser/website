import { useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="reactApp">
            <p>hello from React!</p>

            <button onClick={() => setCount((count) => count + 1)}>I've been clicked {count} times</button>
        </div >
    )
}