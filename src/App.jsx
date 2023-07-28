import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RegisterForm from "./ragister/RegisterForm";
import LogInForm from "./ragister/LogInForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <RegisterForm />
        {/* <LogInForm /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
