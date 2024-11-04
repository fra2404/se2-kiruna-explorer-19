import { IUser } from "./utils/interfaces/user.interface";

const SERVER_URL = 'http://localhost:5001/api'; // endpoint of the server


async function login(email: string, password: string): Promise<{ isLoggedIn: boolean; user: IUser | null }> {
    const response = await fetch(`${SERVER_URL}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    console.log('Response status:', response.status);

    if (!response.ok) {
        return { isLoggedIn: false, user: null };
    }

    // Fai un'altra chiamata per ottenere i dati dell'utente
    const user = await getMe();

    return { isLoggedIn: true, user };
}

async function logout(): Promise<{ isLoggedOut: boolean }> {
    const response = await fetch(`${SERVER_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log('Response status:', response.status);

    if (!response.ok) {
        return { isLoggedOut: false };
    }

    return { isLoggedOut: true };
}

async function getMe(): Promise<IUser> {
    const response = await fetch(`${SERVER_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return await response.json();
}

async function checkAuth(): Promise<{ isLoggedIn: boolean; user: IUser | null }> {
    const response = await fetch(`${SERVER_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        return { isLoggedIn: false, user: null };
    }
    const user = await response.json();
    return { isLoggedIn: true, user };
}


/**
 * This function is used to retrieve all the documents from the backend.
 */
async function getDocuments() {
    return await fetch(`${SERVER_URL}/documents`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiDocumentsToDocuments);
}


// Utility functions:
function handleInvalidResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    const type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}

/**
 * This method is used to parse the information coming from the backend and map it to an array of Document.
 * @param apiDocuments 
 * @returns 
 */
function mapApiDocumentsToDocuments(apiDocuments) {
    return apiDocuments.map(document => new DocumentFile(document.id, document.description, document.title, document.file, document.language, document.issueDate));
}



const API = {
    getDocuments
}

export { login, logout, getMe, checkAuth };
export default API;
