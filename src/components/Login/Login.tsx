import { Api } from '../api/api';
import { CustomState, LoginData, activePage, useCustomState, handleLogin } from '../utils';
import './forms.css';
import React, { useState, FormEvent } from 'react';
import GoogleAuth from '../api/GoogleAuth';

interface LoginProps {
    api: Api;
    loginState: CustomState<LoginData>;
    activePageState: CustomState<activePage>;
    clientId: CustomState<string>;
}


export default function Login({ api, loginState, activePageState, clientId }: LoginProps) {
    return (
        <div>
            <form className="form-container">
                <div className="form-field">
                    <GoogleAuth clientId={clientId.get()} api={api} activePageState={activePageState} loginState={loginState} />
                </div>
            </form>


        </div>
    );
}
