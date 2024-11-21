import Media from '../schemas/media.schema';
import { IReturnMedia, IReturnPresignedUrl } from '@interfaces/media.return.interface';
import { Types } from 'mongoose';
import { IMedia } from '@interfaces/media.interface';
import { CustomError } from '@utils/customError';
import { MediaNotFoundError } from '@utils/errors';

//get type from mimtype
export const getTypeFromMimeType = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) {
    return 'image';
  } else if (mimetype === 'application/pdf') {
    return 'document';
  } else if (mimetype.startsWith('text/')) {
    return 'text';
  } else {
    return 'unknown';
  }
};

export const uploadMediaService = async (mediaData: any): Promise<IReturnPresignedUrl> => {
  try {
    // Step 1: Generate a unique ObjectId without saving to DB
    const generatedId = new Types.ObjectId().toString();

    // Step 2: Prepare data for CDN 
    const cdnRequestData = {
      id: generatedId,
      filename: mediaData.filename,
      contentType: mediaData.mimetype,
      userId: mediaData.userId,
      folder: mediaData.folder || "",
    };

    // Step 3: Make a POST request to CDN to get the presigned URL
    const response: any = await fetch(process.env.CDN_URI + "/generate-presigned-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "my_api_key",
      },
      body: JSON.stringify(cdnRequestData),
    });

    if (!response.ok) {
      throw new CustomError("Failed to obtain presigned URL from CDN", 400);
    }

    // Step 4: Parse the CDN response 
    const cdnResponse = await response.json();
    const { presignedUrl, fileMetadata }: { presignedUrl: IReturnPresignedUrl; fileMetadata: IMedia } = cdnResponse;

    // Step 5: Save metadata along with the CDN output in DB
    const media = new Media({
      _id: generatedId,
      filename: mediaData.filename,
      relativeUrl: fileMetadata.relativeUrl, // URL from CDN
      type: getTypeFromMimeType(mediaData.mimetype), //from getTypeFromMimType methid
      mimetype: mediaData.mimetype,
      size: mediaData.size,
      user: mediaData.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await media.save();

    // Step 6: Return presigned URL
    return presignedUrl;

  } catch (error) {
    console.error("Error in uploadMediaService:", error);
    throw new CustomError('Internal Server Error', 500);
  }
};

//update metadata of media
export const updateMediaMetadata = async (mediaId: string, metadata: any): Promise<void> => {
  const updateFields: any = {};

  if (metadata.pages != null) {
    updateFields.pages = metadata.pages;
  }
  updateFields.size = metadata.size;

  if (Object.keys(updateFields).length === 0) {
    throw new CustomError('No fields to update', 400); // Custom error for no updates
  }

  const updatedMedia = await Media.findByIdAndUpdate(
    mediaId,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedMedia) {
    throw new MediaNotFoundError();
  }
};


export const getMediaMetadataById = async (mediaId: string): Promise<IReturnMedia | null> => {
  const media = await Media.findById(mediaId);

  if (!media) {
    throw new Error('Media not found');
  }

  const mediaMetadata: IReturnMedia = {
    id: media.id,
    filename: media.filename,
    url: media.relativeUrl,
    type: media.type,
    mimetype: media.mimetype,
    pages: media.pages,
  };

  return mediaMetadata;
};

