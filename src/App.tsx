import './App.css';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Signup from './components/Login/Signup';
import { useCustomState, LoginState, activePage } from './components/utils';
import { Api, MockApi } from './components/api/api';
function App() {

    const api = new MockApi();
    const loginState = useCustomState<LoginState>(new LoginState());
    const activePageState = useCustomState<activePage>("login");

    return (
        <>

            <Navbar loginState={loginState} activePageState={activePageState} />

            {(() => {
                switch (activePageState.get()) {
                    case "signup":
                        return <Signup api={api} loginState={loginState} activePageState={activePageState} />;
                    default:
                        return <Login />;
                }
            })()}

        </>
    );
}

export default App;