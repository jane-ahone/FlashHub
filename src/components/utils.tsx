import { useState } from "react";

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

export type activePage = "login" | "signup" | "home" | "profile" | "class" | "settings" | "logout" | "flashcard";

export function parseCookies(): LoginData {
    const cookies: any = {};
    document.cookie.split(';').forEach(function (cookie) {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name !== 'path' && name !== 'expires') { cookies[name] = decodeURIComponent(value); }
    });
    return cookies as LoginData;
}

export function updateCookie(data: LoginData) {
    const keys = Object.keys(data) as Array<keyof LoginData>; // Type assertion
    const cookieString = keys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('; ') + '; expires=' + new Date(data.expiry * 1000).toUTCString() + '; path=/';
    document.cookie = cookieString;
    console.log('cookieString:', cookieString);
}

export function handleLogin(loginState: CustomState<LoginState>, activePage: CustomState<activePage>, response: LoginData) {
    loginState.set(response);
    activePage.set("flashcard");
    updateCookie(response);
    console.log('Signup successful:', response);
}