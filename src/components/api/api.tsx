import { LoginData } from "../utils";



export class Api {
    private static baseUrl = 'http://localhost:3000';
  
    public static async login(username: string, password: string): Promise<LoginData> {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      return await response.json();
    }
  
    public static async signup(name: string, email: string, password: string): Promise<LoginData> {
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
    private static mockData: LoginData = {
        username: 'mockUser',
        jwt: 'mockJwt',
        name: 'mockName',
        email: 'mockEmail',
        id: 'mockId',
        school: 'mockSchool',
        classes: ['mockClass1', 'mockClass2'],
        profilePicUrl: 'mockProfilePicUrl',
    };
    public static async login(_username: string, _password: string): Promise<LoginData> {
        return this.mockData;
    }
    public static async signup(_name: string, _email: string, _password: string): Promise<LoginData> {
        return this.mockData;
    }

}