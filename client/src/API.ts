import { ICoordinate, IDocument } from './utils/interfaces/document.interface';
import { IDocumentType } from './utils/interfaces/documentTypes.interface';
import { IStakeholder } from './utils/interfaces/stakeholders.interface';
import { IUser } from './utils/interfaces/user.interface';

const SERVER_URL = 'https://se2-kiruna-explorer-19-1.onrender.com/api'; // endpoint of the server

async function login(
  email: string,
  password: string,
): Promise<{ isLoggedIn: boolean; user: IUser | null }> {
  const response = await fetch(`${SERVER_URL}/users/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
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
      'Content-Type': 'application/json',
    },
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
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return await response.json();
}

async function checkAuth(): Promise<{
  isLoggedIn: boolean;
  user: IUser | null;
}> {
  const response = await fetch(`${SERVER_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
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
async function getDocuments(): Promise<IDocument[]> {
  try {
    const response = await fetch(`${SERVER_URL}/documents`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const documents = await response.json();
    return documents.sort((a: IDocument, b: IDocument) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }); // Return documents after sorting them by date
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createDocument(documentData: {
  id: string;
  title: string;
  stakeholders: string;
  scale: string;
  type: string;
  language: string;
  summary: string;
  date: string;
  coordinates?: string;
  connections: { document: string; type: string }[];
  media: string[];
}): Promise<{ success: boolean; document?: IDocument }> {
  const response = await fetch(`${SERVER_URL}/documents/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(documentData),
  });
  console.log('Response status:', response.status);

  if (!response.ok) {
    return { success: false };
  }

  const document = await response.json();
  return { success: true, document };
}

/**
 * Post a new document to the backend.
 * @params document: DocumentFile
 * @returns Promise<DocumentFile>
 */

async function addDocument(document: IDocument) {
  return await fetch(`${SERVER_URL}/documents/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(document),
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
}

async function editDocument(documentData: {
  id: string;
  title: string;
  stakeholders: string;
  scale: string;
  type: string;
  language: string;
  summary: string;
  date: string;
  coordinates?: string;
  connections: { document: string; type: string }[];
  media: string[];
}): Promise<{ success: boolean; document?: IDocument }> {
  const response = await fetch(`${SERVER_URL}/documents/${documentData.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(documentData),
  });

  if (!response.ok) {
    return { success: false };
  }

  const document = await response.json();
  return { success: true, document };
}

async function getCoordinates() {
  return await fetch(`${SERVER_URL}/coordinates`, {
    method: 'GET',
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
}

async function getAreas() {
  const coordinates = await getCoordinates();
  const areas = coordinates.filter(
    (coord: ICoordinate) => coord.type === 'Polygon',
  );
  return areas;
}

async function createCoordinate(coord: ICoordinate): Promise<{
  success: boolean;
  coordinate?: { message: string; coordinate: ICoordinate };
}> {
  const response = await fetch(`${SERVER_URL}/coordinates/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(coord),
  });
  if (!response.ok) {
    return { success: false };
  }

  const coordinate: { message: string; coordinate: ICoordinate } =
    await response.json();
  return { success: true, coordinate };
}

async function deleteCoordinate(
  coordId: string,
): Promise<{ success: boolean }> {
  const response = await fetch(`${SERVER_URL}/coordinates/` + coordId, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    return { success: false };
  } else {
    return { success: true };
  }
}

// Utility functions:
function handleInvalidResponse(response: any) {
  console.log('Response is:', response);
  if (!response.ok) {
    console.log('Response status:', response.statusText);
    throw Error(response.statusText || 'An error occurred');
  }
  const type = response.headers.get('Content-Type');
  if (type !== null && type.indexOf('application/json') === -1) {
    throw new TypeError(`Expected JSON, got ${type}`);
  }
  return response;
}

/**
 * This method is used to post a resources to the cdn and backend.
 */
async function addResource(file: File) {
  return await fetch(`${SERVER_URL}/media/upload`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: file.name,
      size: file.size,
      mimetype: file.type,
    }),
  })
    .then(handleInvalidResponse)
    .then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        const body = new FormData();
        body.append('file', file);
        // Resource posted to the CDN
        // use the token returned by the backend. It is contained in the field `data` of the previous response.
        return await fetch(`${data.data}`, {
          method: 'POST',
          credentials: 'include',
          body: body, // Do not set Content-Type header, let the browser set it
        })
          .then(handleInvalidResponse)
          .then(async (response) => {
            const data = await response.json();
            console.log('ID is ', data.id);
            return data.id;
          });
      }
    });
}

async function searchDocuments(
  searchQuery: string,
  filters: {
    type: string | undefined;
    stakeholders: string[] | undefined;
    coordinates: string | undefined;
    date: string | undefined;
    language: string | undefined;
    scale: string | undefined;
    architecturalScale: string | undefined;
  },
): Promise<IDocument[]> {
  const searchURL =
    searchQuery.trim() === ''
      ? `${SERVER_URL}/documents/search`
      : `${SERVER_URL}/documents/search?keywords=[${searchQuery
        .split(' ')
        .map((word) => `"${encodeURIComponent(word)}"`)
        .join(',')}]`;

  let formattedFilters;
  if (filters.scale === '') {
    formattedFilters = {
      type: filters.type,
      stakeholders: filters.stakeholders,
      coordinates: filters.coordinates,
      date: filters.date,
      language: filters.language,
    };
  } else if (filters.architecturalScale === '') {
    formattedFilters = {
      type: filters.type,
      stakeholders: filters.stakeholders,
      coordinates: filters.coordinates,
      date: filters.date,
      language: filters.language,
      scale: filters.scale,
    };
  } else {
    formattedFilters = filters;
  }

  const response = await fetch(searchURL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedFilters),
  });
  if (!response.ok) throw new Error('Failed to fetch documents');

  const documents = await response.json();
  return documents;
}

async function addArea(coordinateData: ICoordinate) {
  const response = await fetch(`${SERVER_URL}/coordinates/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(coordinateData),
  });

  if (response.status === 201)
    return { message: 'Area successfully added', error: false };
  else if (response.status === 400)
    return { message: 'Validation errors', error: true };
  return { message: 'Internal Server Error', error: true };
}

async function removeArea(areaId: any) {
  const response = await fetch(`${SERVER_URL}/coordinates/delete/${areaId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (response.status === 200)
    return { message: 'Area successfully', error: false };
  return { message: 'Error while deleting', error: true };
}

async function getGraphInfo() {
  try {
    return await fetch(`${SERVER_URL}/graph`, {
      method: 'GET',
    })
      .then(handleInvalidResponse)
      .then((response) => response.json());
  } catch (error) {
    console.log(error);
  }
}

async function getDocumentById(documentId: string) {
  return await fetch(`${SERVER_URL}/documents/${documentId}`, {
    method: 'GET',
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
}

async function getTypes() {
  try {
    return await fetch(`${SERVER_URL}/documents/types/all`, {
      method: 'GET',
    })
      .then(handleInvalidResponse)
      .then((response) => response.json());
  } catch (error) {
    console.log(error);
  }
}

async function getStakeholders(): Promise<{ value: string; label: string }[]> {
  try {
    const response = await fetch(`${SERVER_URL}/stakeholders`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stakeholders');
    }

    const data: IStakeholder[] = await response.json();
    const stakeholders = data.map((stakeholder) => ({
      value: stakeholder._id,
      label: stakeholder.type,
    }));
    return stakeholders;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createStakeholder(newStakeholderType: string): Promise<{ value: string; label: string }> {
  try {
    const response = await fetch(`${SERVER_URL}/stakeholders/add`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStakeholderType }),
    });

    if (!response.ok) {
      throw new Error('Failed to create stakeholder');
    }

    const stakeholder: IStakeholder = await response.json();
    return { value: stakeholder._id, label: stakeholder.type };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getDocumentTypes(): Promise<{ value: string; label: string }[]> {
  try {
    const response = await fetch(`${SERVER_URL}/document-types`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch document types');
    }

    const data: IDocumentType[] = await response.json();
    const documentTypes = data.map((docType) => ({
      value: docType._id,
      label: docType.type,
    }));
    return documentTypes;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createDocumentType(newDocumentType: string): Promise<{ value: string; label: string }> {
  try {
    const response = await fetch(`${SERVER_URL}/document-types/add`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newDocumentType }),
    });

    if (!response.ok) {
      throw new Error('Failed to create document type');
    }

    const docType: IDocumentType = await response.json();
    return { value: docType._id, label: docType.type };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const API = {
  getDocuments,
  getCoordinates,
  addDocument,
  deleteCoordinate,
  searchDocuments,
  getGraphInfo,
  addArea,
  removeArea,
  getAreas,
  getDocumentById,
  getStakeholders,
  createStakeholder,
  getDocumentTypes,
  createDocumentType,
};

export {
  login,
  logout,
  getMe,
  checkAuth,
  createDocument,
  editDocument,
  getDocuments,
  createCoordinate,
  searchDocuments,
  addResource,
  getGraphInfo,
  getTypes,
  getStakeholders,
  createStakeholder,
  getDocumentTypes,
  createDocumentType,
};
export default API;