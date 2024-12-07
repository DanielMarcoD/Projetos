import AppBar from "./components/AppBar";
import "./App.css";
import Login from "./components/Login";
import axios from "axios";



function App() {

  

  return (
    <>
      <AppBar />
      <main>
        <Login />
      </main>
    </>
  );
}

export default App;
