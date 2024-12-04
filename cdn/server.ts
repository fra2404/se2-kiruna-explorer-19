import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import pdfParse from 'pdf-parse';
import NodeCache from 'node-cache';
import cors from 'cors';
import axios from 'axios';

// Determina quale file .env caricare
const envFile = process.env.DOCKER_ENV ? '.env.docker' : '.env.local';

// Carica le variabili d'ambiente dal file specificato
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT ?? 3005;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const SECRET_KEY = process.env.SECRET_KEY ?? 'your_secret_key';
const cache = new NodeCache({ stdTTL: 600 }); // Cache with a TTL of 10 minutes

app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

// Configuration of multer for file handling
const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        const token = req.query.token as string;
        const payload = jwt.verify(token, SECRET_KEY) as JwtPayload & {
            folder: string;
        };

        const folderPath = path.join(UPLOAD_DIR, payload.folder);
        fs.mkdir(folderPath, { recursive: true })
            .then(() => cb(null, folderPath))
            .catch((error) => cb(error as Error, 'error'));
    },
    filename: (req, file, cb) => {
        const token = req.query.token as string;
        const payload = jwt.verify(token, SECRET_KEY) as JwtPayload & {
            id: string;
        };
        const extension = path.extname(file.originalname); // Ottieni l'estensione del file
        cb(null, `${payload.id}${extension}`); // Usa l'ID passato come nome del file
    },
});
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

interface JwtPayload {
    id: string;
    filename: string;
    contentType: string;
    userId: string;
    exp: number;
}

// Blacklist of invalidated tokens
const tokenBlacklist = new Set<string>();

// Middleware to check if a token is in the blacklist
const checkTokenBlacklist = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.query.token as string;
    if (tokenBlacklist.has(token)) {
        return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    next();
};

// Function to add a token to the blacklist and remove it after expiration
const addToBlacklist = (token: string, exp: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToLive = exp - currentTime;

    tokenBlacklist.add(token);

    setTimeout(() => {
        tokenBlacklist.delete(token);
    }, timeToLive * 1000); // Convert time to milliseconds
};

// Middleware to check the API key
const authenticateApiKey = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== (process.env.API_KEY || 'my_api_key')) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    next();
};

// Increase the payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Endpoint to generate the presigned URL (protected)
app.post(
    '/generate-presigned-url',
    authenticateApiKey,
    async (req: Request, res: Response): Promise<void> => {
        const { id, filename, contentType, userId, folder } = req.body;

        if (!id || !filename || !contentType || !userId) {
            res
                .status(400)
                .json({ error: 'Id, Filename, Content-Type, and userId are required' });
            return;
        }

        const targetFolder = folder || ''; // Use '' if folder is not provided, which means directly in 'uploads'

        // Create a JWT token to authenticate the upload, valid for 5 minutes
        const token = jwt.sign(
            {
                id,
                filename,
                contentType,
                userId,
                folder: targetFolder,
                exp: Math.floor(Date.now() / 1000) + 60 * 5,
            },
            SECRET_KEY,
        );

        // Save the file metadata in the database (or a simulated data structure)
        const fileMetadata = {
            filename,
            id,
            relativeUrl: `/cdn/${targetFolder ? targetFolder + '/' : ''}${id}`,
            contentType,
            uploadDate: new Date(),
            userId,
            folder: targetFolder,
        };

        // Here you should save `fileMetadata` in the database.
        // Example: await database.saveFileMetadata(fileMetadata);
        console.log('Metadata saved in the database:', fileMetadata);

        // Create the presigned URL for the upload
        const presignedUrl = `${process.env.CDN_URI}/upload-file?token=${token}`;
        const finalUrl = `${req.protocol}://${req.get('host')}/cdn/${targetFolder ? targetFolder + '/' : ''}${id}`;
        res.json({ presignedUrl, finalUrl, fileMetadata });
    },
);

// Endpoint to upload the file via presigned URL
app.post(
    '/upload-file',
    checkTokenBlacklist,
    upload.single('file'),
    async (req: Request, res: Response): Promise<void> => {
        const token = req.query.token as string;

        if (!token) {
            res.status(400).json({ error: 'Token is required' });
            return;
        }

        // Verify the token and get the file data
        try {
            const payload = jwt.verify(token, SECRET_KEY) as JwtPayload & {
                folder: string;
            };

            if (!req.file || req.file.originalname !== payload.filename) {
                res.status(400).json({ error: 'Filename does not match' });
                return;
            }

            // Add the token to the blacklist and set a timeout to remove it
            addToBlacklist(token, payload.exp);

            // Analyze the file to get additional metadata (e.g., number of pages)
            let numberOfPages = null;
            console.log('File uploaded:', req.file.originalname);
            if (req.file.mimetype === 'application/pdf') {
                console.log('Analyzing PDF...');
                const filePath = path.join(
                    UPLOAD_DIR,
                    payload.folder,
                    req.file.filename,
                );
                const data = await pdfParse(await fs.readFile(filePath));
                console.log('PDF analysis complete.');
                numberOfPages = data.numpages;
            }

            // Update the file metadata in the database
            // Example: await database.updateFileMetadata(payload.filename, { pages: numberOfPages });
            console.log('File metadata updated with number of pages:', numberOfPages);

            // Get the filename without extension
            const fileNameWithoutExt = path.parse(req.file.filename).name;

            // Prepare the metadata to send to the external API
            const fileMetadata = {
                mediaId: fileNameWithoutExt,
                metadata: {
                    size: req.file.size,
                    page: numberOfPages
                },
                url: `${req.protocol}://${req.get('host')}/cdn/${payload.folder ? payload.folder + '/' : ''}${fileNameWithoutExt}`
            };

            console.log('File metadata to send to the external API:', fileMetadata);

            // Call the external API with the metadata
            try {
                const apiResponse = await axios.put(
                    process.env.SERVER ?? 'http://localhost:5001/api/media/update',
                    fileMetadata,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.API_KEY ?? 'my-api-key',
                        },
                    },
                );

                if (apiResponse.status !== 200) {
                    throw new Error('Failed to call external API');
                }

                console.log('External API response:', apiResponse.data);
            } catch (apiError) {
                console.error('Error calling external API:', apiError);
                res.status(500).json({ error: 'Error calling external API' });
                return;
            }

            // Confirm successful upload
            res.status(200).json({
                message: 'File uploaded successfully',
                url: fileMetadata.url,
                id: fileNameWithoutExt,
            });
        } catch (error) {
            res.status(403).json({ error: 'Token is invalid or expired' });
        }
    },
);

// Endpoint to retrieve the file without considering the extension
app.get('/cdn/*', async (req: Request, res: Response): Promise<void> => {
    const filePathWithoutExt = path.join(UPLOAD_DIR, req.params[0]);
    const dir = path.dirname(filePathWithoutExt);
    const baseName = path.basename(filePathWithoutExt);

    // Check cache first
    const cachedFile = cache.get<string>(filePathWithoutExt);
    if (cachedFile) {
        return res.sendFile(cachedFile);
    }

    try {
        const files = await fs.readdir(dir);
        const matchedFile = files.find(
            (file) => path.parse(file).name === baseName,
        );

        if (matchedFile) {
            const fullPath = path.join(dir, matchedFile);
            cache.set(filePathWithoutExt, fullPath); // Cache the result
            res.sendFile(fullPath); // Send the file to the client
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.error(`Error retrieving file: ${filePathWithoutExt} `, error);
        res.status(404).json({ error: 'File not found' });
    }
});

// Middleware for error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} `);
});