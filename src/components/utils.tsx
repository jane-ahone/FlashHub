import { jwtVerify, importJWK } from "jose";
import { useState } from "react";
import { Api, googleJWKSUri } from "./api/api";

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

export interface courseRep {
    id: number;
    name: string;
}

export interface LoginData {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    username: string;
    email: string;
    user_type: string;
    school: string;
    profile_url: string;
    courses: courseRep[];
    friends_count: number;
    pending_sent_requests: number;
    pending_received_requests: number;
    jwt: string;
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
    email: string;
    id: number;
    school: string;
    profile_url: string;
    expiry: number;
    first_name: string;
    last_name: string;
    phone: string;
    user_type: string;
    courses: courseRep[];
    friends_count: number;
    pending_sent_requests: number;
    pending_received_requests: number;

    constructor(
        username: string = '',
        jwt: string = '',
        email: string = '',
        id: number = 0,
        school: string = '',
        profilePicUrl: string = '',
        isLogged: boolean = false,
        expiry: number = 0,
        first_name: string = '',
        last_name: string = '',
        phone: string = '',
        user_type: string = '',
        courses: courseRep[] = [],
        friends_count: number = 0,
        pending_sent_requests: number = 0,
        pending_received_requests: number = 0
    ) {
        this.isLogged = isLogged;
        this.username = username;
        this.jwt = jwt;
        this.email = email;
        this.id = id;
        this.school = school;
        this.profile_url = profilePicUrl;
        this.expiry = expiry;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.user_type = user_type;
        this.courses = courses;
        this.friends_count = friends_count;
        this.pending_sent_requests = pending_sent_requests;
        this.pending_received_requests = pending_received_requests;

    }
}

export type activePage = "login" | "home" | "profile" | "class" | "settings" | "logout" | "flashcard" | "about";

export function parseCookies(loginState: CustomState<LoginData>, activePageState: CustomState<activePage>, api: Api) {
    document.cookie.split(';').forEach(function (cookie) {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name === "jwt" && value !== "" && value !== "null" && value !== "undefined") {
            api.get_user(value).then((response) => {
                if (!("error" in response)) {
                    activePageState.set("flashcard");
                    loginState.set(
                        response
                    );
                } else {
                    activePageState.set("login");
                }
            }).catch((error) => {
                console.error(error);
            });

        }

    });
}

export function updateCookie(data: LoginData) {
    document.cookie = "jwt=" + data.jwt + "; expires=" + new Date(data.expiry).toUTCString();
}

export function handleLogin(loginState: CustomState<LoginData>, activePage: CustomState<activePage>, response: LoginData) {
    loginState.set(response);
    activePage.set("flashcard");
    updateCookie(response);
}

export async function verifyAndDecodeJWT(token: string, jwksUri: string = googleJWKSUri) {
    try {
        const { payload, protectedHeader } = await jwtVerify(token, async (header) => {
            // Fetch Google's JWKS (JSON Web Key Set)
            const response = await fetch(jwksUri);
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
