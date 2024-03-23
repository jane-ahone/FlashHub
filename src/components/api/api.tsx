import { LoginData } from "../utils";
import { Card } from "../FlashCard/utils";
import { verifyAndDecodeJWT } from "../utils";



export const googleJWKSUri = 'https://www.googleapis.com/oauth2/v3/certs';

export class Api {
    private baseUrl = 'http://localhost:8000';

    public async login(jwt: string): Promise<LoginData> {
        const data = JSON.stringify({ jwt: jwt });
        console.log('data:', data);
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        });
        const result = await response.json();
        const flash_api_resp = result['token'];

        console.log('flash_api_resp:', flash_api_resp);

        const user = await this.get_user(flash_api_resp);
        user.expiry = result['exp'];
        user.jwt = flash_api_resp;

        return user;
    }

    public async get_user(jwt: string): Promise<LoginData> {
        const response = await fetch(`${this.baseUrl}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jwt: jwt }),
        });
        const result: LoginData = await response.json();
        result.isLogged = true;
        return result;
    }



    public async signup(name: string, email: string, userName: string, password: string): Promise<LoginData> {
        const response = await fetch(`${this.baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        return await response.json();
    }

    public async getCards(flashcard_id: string): Promise<Card[]> {
        const response = await fetch(`${this.baseUrl}/flashcard/${flashcard_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }
}

export class MockApi extends Api {
    // private mockData: LoginData = {
    //     username: 'mockUser',
    //     jwt: 'mockJwt',
    //     first_name: 'mockFirstName',
    //     last_name: 'mockLastName',
    //     email: 'mockEmail',
    //     id: 123,
    //     school: 'mockSchool',
    //     profile_url: 'mockProfilePicUrl',
    //     isLogged: true,
    //     expiry: 1807843735,
    // };

    // public async login(credential: string): Promise<LoginData> {
    //     const response = await verifyAndDecodeJWT(credential);
    //     let tmpData: LoginData = {
    //         username: response.email,
    //         jwt: credential,
    //         name: response.name,
    //         email: response.email,
    //         id: response.sub,
    //         school: response.hd,
    //         profile_url: response.picture,
    //         isLogged: true,
    //         expiry: response.exp * 1000,
    //     };
    //     console.log('Mock Login response:', tmpData);
    //     return tmpData;
    // }

    // public async signup(name: string, email: string, userName: string, password: string): Promise<LoginData> {
    //     return this.mockData;
    // }

    public async getCards(_flashcard_id: string): Promise<Card[]> {
        return [
            {
                question: 'What is 2 + 2?',
                answers: ['2', '3', '4', '5'],
                correctAnswer: '4',
            },
            {
                question: 'What is 3 * 3?',
                answers: ['6', '7', '8', '9'],
                correctAnswer: '9',
            },
            {
                question: 'What is the capital of France?',
                answers: ['London', 'Paris', 'Berlin', 'Madrid'],
                correctAnswer: 'Paris',
            }
        ];
    }

}