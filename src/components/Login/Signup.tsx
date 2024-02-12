import { FormEvent } from 'react';
import { useCustomState, LoginState, CustomState, activePage } from '../utils';
import { Api } from '../api/api';
interface SignupProps {
    api: Api;
    loginState: CustomState<LoginState>;
    activePageState: CustomState<activePage>;
}

export default function Signup(props: SignupProps): JSX.Element {
    const name = useCustomState<string>('');
    const email = useCustomState<string>('');
    const password = useCustomState<string>('');
    const confirmPassword = useCustomState<string>('');
    const userName = useCustomState<string>('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add your signup logic here, e.g., form validation, sending data to a server, etc.
        console.log('Signing up with:', name.get(), email.get(), userName.get(), password.get(), confirmPassword.get());
        props.api.signup(name.get(), email.get(), userName.get(), password.get()).then((response) => {
            props.loginState.set(response);
            props.activePageState.set("profile");
            console.log('Signup successful:', props.loginState.get());
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-heading">Signup</h2>
                <div className="form-field">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name.get()}
                        onChange={(e) => name.set(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email.get()}
                        onChange={(e) => email.set(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor='username'>Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={userName.get()}
                        onChange={(e) => userName.set(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password.get()}
                        onChange={(e) => password.set(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword.get()}
                        onChange={(e) => confirmPassword.set(e.target.value)}
                        required
                    />
                </div>
                <div className="form-submit">
                    <button type="submit" className="form-button">SignUp</button>
                </div>
            </form>
        </div>
    );
}