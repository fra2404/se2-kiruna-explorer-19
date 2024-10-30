const SERVER_URL = 'http://localhost:5001/api'; // endpoint of the server



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

export default API