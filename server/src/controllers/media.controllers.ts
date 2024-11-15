import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { updateMediaMetadata, uploadMediaService } from '@services/media.service';

/**
@swagger
  /api/media/upload:
    post:
      summary: Upload media file
      description: This endpoint handles getting metadata of a file from FE and returns them to the CDN, finally
      save metadata including relativeUrl in DB, also returns presigned URL to FE.
      parameters:
        - in: body
          name: body
          description: Media file data for uploading
          required: true
          schema:
            type: object
            properties:
              filename:
                type: string
                description: The name of the file to be uploaded
                example: "example-file.pdf"
              size:
                type: integer
                description: The size of the file
                example: 204800
              mimetype:
                type: string
                description: The MIME type of the file
                example: "application/pdf"
      responses:
        200:
          description: Media uploaded and metadata saved successfully, with presigned URL
        400:
          description: Bad Request - Invalid input data
        401:
          description: Unauthorized - User not authenticated
        500:
          description: Internal Server Error - Failed to upload media

**/

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
  @swagger
    /api/media/update:
      put:
        summary: Update media metadata from CDN output
        description: Endpoint to update media metadata like pages from CDN.
        parameters:
          - in: body
            name: body
            description: Media data to update
            required: true
            schema:
              type: object
              properties:
                mediaId:
                  type: string
                  description: The ID of the media to update
                metadata:
                  type: object
                  properties:
                    pages:
                      type: integer
                      description: Number of pages in the media (optional)
        responses:
          200:
            description: Media metadata updated successfully
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: 'Media metadata updated successfully'
                updatedMedia:
                  type: object
                  description: The updated media object
          400:
            description: Bad Request - Invalid input
          500:
            description: Internal Server Error - Failed to update media metadata
**/
  //Update media from CDN
  export const UpdateMediaController = async (req: Request, res: Response, next: NextFunction,): Promise<void> => {
    try {
      const { mediaId, metadata } = req.body;
  
       const updatedMedia = await updateMediaMetadata(mediaId, metadata);
  
        res.status(200).json({
        message: 'Media metadata updated successfully',
        updatedMedia,
      });
    } catch (error) {
      next(error); // Pass any errors to the global error handler
    }
  };