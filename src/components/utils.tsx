import { jwtVerify, importJWK } from "jose";
import { useState } from "react";
import { googleJWKSUri } from "./api/api";

export interface CustomState<T> {
    get: () => T;
    set: (value: T) => void;
}

export function useCustomState<T>(initialValue: T): CustomState<T> {
    const [state, set] = useState(initialValue);
    const get = () => {
        return state;
    };

    return { get, set };
}



export interface LoginData {
    username: string;
    jwt: string;
    name: string;
    email: string;
    id: string;
    school: string;
    profilePicUrl: string;
    isLogged: boolean;
    expiry: number;
}

export interface SignUpData {
    name: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export class LoginState implements LoginData {
    username: string;
    isLogged: boolean;
    jwt: string;
    name: string;
    email: string;
    id: string;
    school: string;
    profilePicUrl: string;
    expiry: number;
    constructor(
        username: string = '',
        jwt: string = '',
        name: string = '',
        email: string = '',
        id: string = '',
        school: string = '',
        profilePicUrl: string = '',
        isLogged: boolean = false,
        expiry: number = 0,
    ) {
        this.isLogged = isLogged;
        this.username = username;
        this.jwt = jwt;
        this.name = name;
        this.email = email;
        this.id = id;
        this.school = school;
        this.profilePicUrl = profilePicUrl;
        this.expiry = expiry;
    }
}

export type activePage = "login" | "home" | "profile" | "class" | "settings" | "logout" | "flashcard" | "about";

export function parseCookies(loginState: CustomState<LoginState>, activePageState: CustomState<activePage>) {
    document.cookie.split(';').forEach(function (cookie) {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name === "jwt") {
            verifyAndDecodeJWT(value).then((response) => {

                let tmpData: LoginData = {
                    username: response.email,
                    jwt: value,
                    name: response.name,
                    email: response.email,
                    id: response.sub,
                    school: response.hd,
                    profilePicUrl: response.picture,
                    isLogged: true,
                    expiry: response.exp * 1000,
                };
                if (tmpData.isLogged && tmpData.expiry > Date.now()) {
                    console.log('User is already logged in:', tmpData);
                    loginState.set(tmpData);
                    activePageState.set("flashcard");
                } else {
                    console.log('User is not logged in:', tmpData);

                }

            }
            );

        }

    });
}

export function updateCookie(data: LoginData) {
    document.cookie = "jwt=" + data.jwt + "; expires=" + new Date(data.expiry).toUTCString();
}

export function handleLogin(loginState: CustomState<LoginState>, activePage: CustomState<activePage>, response: LoginData) {
    loginState.set(response);
    activePage.set("flashcard");
    updateCookie(response);
}
export async function verifyAndDecodeJWT(token: string) {
    try {
        const { payload, protectedHeader } = await jwtVerify(token, async (header) => {
            // Fetch Google's JWKS (JSON Web Key Set)
            const response = await fetch(googleJWKSUri);
            const jwks = await response.json();

            // Find the correct key in the JWKS by matching the 'kid' (key ID)
            const signingKey = jwks.keys.find((key: { kid: string | undefined; }) => key.kid === header.kid);
            if (!signingKey) {
                throw new Error('Signing key not found in JWKS');
            }

            // Construct and return the appropriate public key to verify the JWT
            return await importJWK(signingKey, header.alg);
        }, {
            issuer: 'https://accounts.google.com',
        });
        return JSON.parse(JSON.stringify(payload));
    } catch (error) {
        console.error('Failed to verify JWT:', error);
    }
}
