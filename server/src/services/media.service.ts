import Media from '@schemas/media.schema';
import { IReturnPresignedUrl } from '@interfaces/media.return.interface';
import { Types } from 'mongoose';
import { IMedia } from '@interfaces/media.interface';


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
    const response: any = await fetch("http://localhost:3004/generate-presigned-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "my_api_key",
      },
      body: JSON.stringify(cdnRequestData),
    });

    if (!response.ok) {
      throw new Error("Failed to obtain presigned URL from CDN");
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
    throw new Error("Failed to upload media");
  }
};


//Update Medida From What CDN Will Send
export const updateMediaMetadata = async (mediaId: string, metadata: any): Promise<void> => {
  try {
    console.log('Updating media metadata:', metadata);
    // TODO: problem here, 
    // Only update if pages is not null or undefined
    const updateFields: any = {};

    if (metadata.pages != null) {
      updateFields.pages = metadata.pages;
    }

    if (Object.keys(updateFields).length === 0) {
      // If there are no fields to update, exit
      return;
    }

    updateFields.size = metadata.size;
    const updatedMedia = await Media.findByIdAndUpdate(
      mediaId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedMedia) {
      throw new Error('Media not found');
    }
  } catch (error) {
    console.error('Error in updating media metadata:', error);
    throw new Error('Failed to update metadata');
  }
};

