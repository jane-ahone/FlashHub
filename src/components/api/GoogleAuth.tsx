import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecrypt } from 'jose';
import React, { useEffect } from 'react'
import { CustomState, LoginData, activePage, handleLogin } from '../utils';
import { Api } from './api';

interface GoogleAuthProps {
    clientId: string;
    activePageState: CustomState<activePage>;
    loginState: CustomState<LoginData>;
    api: Api;
}

const GoogleAuth = ({ clientId, api, activePageState, loginState }: GoogleAuthProps) => {

    return (
        <div>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        if (credentialResponse.credential) {
                            api.login(credentialResponse.credential).then((response) => {
                                console.log('API Login response:', response);
                                if (response.isLogged) {
                                    handleLogin(loginState, activePageState, response);
                                }
                            }
                            ).catch((error) => {
                                console.error(error);
                            });
                        }
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </GoogleOAuthProvider>
        </div>
    )
}

export default GoogleAuth
