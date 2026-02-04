import { useState } from "react";
import Wrapper from "./components/Wrapper";
import Layout from "./components/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Layout>
      <Wrapper>
        <h1 className="text-4xl text-red-700">Vite + React</h1>
        <div className="">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </Wrapper>
    </Layout>
  );
}

export default App;
