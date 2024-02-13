import { LoginData } from "../utils";
import { Card } from "../FlashCard/utils";


export class Api {
    private baseUrl = 'http://localhost:3000';

    public async login(username: string, password: string): Promise<LoginData> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return await response.json();
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
    private mockData: LoginData = {
        username: 'mockUser',
        jwt: 'mockJwt',
        name: 'mockName',
        email: 'mockEmail',
        id: 'mockId',
        school: 'mockSchool',
        profilePicUrl: 'mockProfilePicUrl',
        isLogged: true,
        expiry: 1807843735,
    };
    public async login(_username: string, _password: string): Promise<LoginData> {
        return this.mockData;
    }
    public async signup(name: string, email: string, userName: string, password: string): Promise<LoginData> {
        return this.mockData;
    }
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