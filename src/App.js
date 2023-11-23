import Layout from "./components/Layout/Layout";
import ContextLayers from "./components/ContextLayers/ContextLayers";
import "./App.css";
import "./index.css";

function App() {
  return (
    <div className="App">
      <ContextLayers>
        <Layout />
      </ContextLayers>
    </div>
  );
}

export default App;
