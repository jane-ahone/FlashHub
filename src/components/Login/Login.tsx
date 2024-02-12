import './forms.css';
import React, { useState, FormEvent } from 'react';

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submit action
        // Handle the login logic here, e.g., calling an authentication API
        console.log('Logging in with:', username, password);
        // Reset form fields after submission
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-heading">Login</h2>
                <div className="form-field">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-submit">
                    <button type="submit" className="form-button">Login</button>
                </div>
            </form>
        </div>
    );
}
