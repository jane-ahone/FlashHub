import { LoginData } from "../utils";
import { Card } from "../FlashCard/utils";
import { jwtVerify, importJWK } from 'jose';



const googleJWKSUri = 'https://www.googleapis.com/oauth2/v3/certs';

async function verifyAndDecodeJWT(token: string) {
    try {
        const { payload, protectedHeader } = await jwtVerify(token, async (header) => {
            // Fetch Google's JWKS (JSON Web Key Set)
            const response = await fetch(googleJWKSUri);
            const jwks = await response.json();
            console.log('JWKS:', jwks)

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
        return payload;
    } catch (error) {
        console.error('Failed to verify JWT:', error);
    }
}

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
    public async login(credential: string, _password: string): Promise<LoginData> {
        const response = await verifyAndDecodeJWT(credential);

        const newResponse = JSON.parse(JSON.stringify(response));

        let tmpData: LoginData = {
            username: newResponse.email,
            jwt: credential,
            name: newResponse.name,
            email: newResponse.email,
            id: newResponse.sub,
            school: newResponse.hd,
            profilePicUrl: newResponse.picture,
            isLogged: true,
            expiry: newResponse.exp,
        };
        console.log('Mock Login response:', tmpData);
        return tmpData;
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