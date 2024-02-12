import { LoginData } from "../utils";



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
}

export class MockApi extends Api {
    private mockData: LoginData = {
        username: 'mockUser',
        jwt: 'mockJwt',
        name: 'mockName',
        email: 'mockEmail',
        id: 'mockId',
        school: 'mockSchool',
        classes: ['mockClass1', 'mockClass2'],
        profilePicUrl: 'mockProfilePicUrl',
        isLogged: true,
    };
    public async login(_username: string, _password: string): Promise<LoginData> {
        return this.mockData;
    }
    public async signup(name: string, email: string, userName: string, password: string): Promise<LoginData> {
        return this.mockData;
    }

}