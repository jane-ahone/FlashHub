import './App.css';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Signup from './components/Login/Signup';
import { useCustomState, LoginState, activePage, parseCookies } from './components/utils';
import { Api, MockApi } from './components/api/api';
import FlashCard from './components/FlashCard/FlashCard';
import { Card } from './components/FlashCard/utils';
import { useEffect } from 'react';
import google_oauth_client from './components/api/google_oauth_client.json';
function App() {

    const api = new MockApi();
    const loginState = useCustomState<LoginState>(new LoginState());
    const activePageState = useCustomState<activePage>("login");
    const cards = useCustomState<Card[]>([]);
    const clientId = useCustomState<string>('');

    useEffect(() => {

        const LoginData = parseCookies();
        if (LoginData.isLogged && LoginData.expiry > Date.now()) {
            console.log('User is already logged in:', LoginData);
            loginState.set(LoginData);
            activePageState.set("flashcard");
        } else {
            console.log('User is not logged in:', LoginData);

        }
        api.getCards('flashcard_id').then((response) => {
            console.log(response);
            cards.set(response);
        }
        ).catch((error) => {
            console.error(error);
        });

        console.log('cloudAuth Data:', google_oauth_client.web.client_id);
        clientId.set(google_oauth_client.web.client_id);

    }, []);

    return (
        <>
            <Navbar loginState={loginState} activePageState={activePageState} />
            {(() => {
                switch (activePageState.get()) {
                    case "flashcard":
                        return <FlashCard cards={cards} />;
                    default:
                        return <Login api={api} loginState={loginState} activePageState={activePageState} clientId={clientId} />;
                }
            })()}
        </>
    );
}

export default App;