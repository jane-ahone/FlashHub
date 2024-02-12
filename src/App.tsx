import './App.css';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Signup from './components/Login/Signup';
import { useCustomState, LoginState, activePage } from './components/utils';
function App() {

  const loginState = useCustomState<LoginState>(new LoginState());
  const activePageState = useCustomState<activePage>("login");

  return (
    <>

      <Navbar loginState={loginState} activePageState={activePageState} />

      {(() => {
        switch (activePageState.get()) {
          case "signup":
            return <Signup />;
          default:
            return <Login />;
        }
      })()}

    </>
  );
}

export default App;