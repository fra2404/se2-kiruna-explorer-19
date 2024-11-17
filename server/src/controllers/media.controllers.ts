import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { getMediaMetadataById, 
         updateMediaMetadata, 
         uploadMediaService } from '@services/media.service';
import { MediaNotFoundError } from '@utils/errors';
import { CustomError } from '@utils/customError';

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload a media file
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Name of the file
 *                 example: example.pdf
 *               size:
 *                 type: number
 *                 description: Size of the file
 *                 example: 1048
 *               mimetype:
 *                 type: string
 *                 description: MIME type of the file
 *                 example: application/pdf
 *     responses:
 *       200:
 *         description: Media file uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: File validated and metadata saved successfully
 *                 data:
 *                   type: object
 *                   description: Metadata of the uploaded media
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: example.pdf
 *                     url:
 *                       type: string
 *                       description: URL for the uploaded file
 *                     type:
 *                       type: string
 *                       description: Type of the media based on its mimetype
 *                       example: document
 *                     mimetype:
 *                       type: string
 *                       example: application/pdf
 */

//upload media
export const uploadMediaController = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Step 1: Extract data from the request body
      const { filename, size, mimetype } = req.body;
  
      // Step 2: Get the current user ID from the request (from authentication middleware)
      const userId = req.user?.id;
      if (!userId) {
         res.status(401).json({ message: 'User not authenticated' });
         return;
      }
  
      // Step 3: Call the service and pass the data (file info and user ID)
      const mediaMetadata = await uploadMediaService({
        filename,
        size,
        mimetype,
        userId,
      });
  
      // Step 4: Return response with metadata and presigned URL
      res.status(200).json({
        message: 'File validated and metadata saved successfully',
        data: mediaMetadata, // This should include the presigned URL and other data
      });
    } catch (error) {
      next(error); // Pass any errors to the global error handler
    }
  };
  


/**
 * @swagger
 * /api/media/update:
 *   put:
 *     summary: Update media metadata based on CDN response
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaId:
 *                 type: string
 *                 description: ID of the media to update
 *                 example: 64bfad3f4b5d2c001c8e4f2e
 *               metadata:
 *                 type: object
 *                 description: Metadata to update for the media
 *                 properties:
 *                   pages:
 *                     type: number
 *                     description: Number of pages (if applicable). This is optional.
 *                     example: 10
 *                   size:
 *                     type: number
 *                     description: The size of the media. This is required.
 *                     example: 2048
 *                 required:
 *                   - size  # 'size' is mandatory, 'pages' is optional
 *     responses:
 *       200:
 *         description: Media metadata updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Media metadata updated successfully
 *       400:
 *         description: Bad Request (No fields to update or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: No fields to update
 *       404:
 *         description: Media not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Media not found
 *       500:
 *         description: Internal Server Error (unexpected error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server Error
 */
 
  export const UpdateMediaController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { mediaId, metadata } = req.body;
  
      await updateMediaMetadata(mediaId, metadata);
  
      res.status(200).json({
        message: 'Media metadata updated successfully',
      });
    } catch (error: any) {
      // Handle known errors
      if (error instanceof MediaNotFoundError || error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
        return;
      }
  
      // Pass unexpected errors to global error handler
      next(error);
    }
  };




  /**
 * @swagger
 * /api/media/{mediaId}:
 *   get:
 *     summary: Retrieve media metadata by ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         description: ID of the media to retrieve metadata for
 *         schema:
 *           type: string
 *           example: 64bfad3f4b5d2c001c8e4f2e
 *     responses:
 *       200:
 *         description: Media metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Media metadata retrieved successfully
 *                 data:
 *                   type: object
 *                   description: Media metadata
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: example.pdf
 *                     url:
 *                       type: string
 *                       description: Media URL
 *                       example: /cdn/6738bb5c15c34c39f5383bb8
 *                     type:
 *                       type: string
 *                       example: document
 *                     mimetype:
 *                       type: string
 *                       example: application/pdf
 *                     pages:
 *                       type: number
 *                       example: 10
 *       404:
 *         description: Media not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Media not found
 */
  //get Media by Id
  export const getMediaMetadataByIdController = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    try {  
      const mediaMetadata = await getMediaMetadataById(req.params.mediaId);
  
      if (!mediaMetadata) {
        throw new MediaNotFoundError();
      }
  
      res.status(200).json({
        message: 'Media metadata retrieved successfully',
        data: mediaMetadata, 
      });
    } catch (error) {
      next(error); // Pass any errors to the global error handler
    }
  };