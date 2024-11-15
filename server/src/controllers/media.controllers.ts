import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { updateMediaMetadata, uploadMediaService } from '@services/media.service';
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
  
  
  //Update media from CDN
  export const UpdateMediaController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mediaId, metadata } = req.body;
  
       const updatedMedia = await updateMediaMetadata(mediaId, metadata);
  
        res.status(200).json({
        message: 'Media metadata updated successfully',
        updatedMedia,
      });
    } catch (error) {
      console.error('Error in updating file metadata:', error);
      res.status(500).json({ error: 'Failed to update file metadata' });
    }
  };