import Stakeholder from '../schemas/stakeholder.schema';
import { CustomError } from '@utils/customError';
import { IStakeholder } from '@interfaces/stakeholder.interface';
import { StakeholderNotFoundError } from '@utils/errors';
import { ObjectId } from 'mongoose';


//Add new stakeholder
export const addingStakeholder = async (
  stakeholderData: any,
): Promise<IStakeholder> => {
  try {
    // Step 5: Save metadata along with the CDN output in DB
    const stakeholder = new Stakeholder({
      type: stakeholderData.newStakeholderType,
    });

    const NewStakeholder = await stakeholder.save();
    return NewStakeholder;
  } catch (error) {
    //console.error('Error in uploadMediaService:', error);
    throw new CustomError('Internal Server Error', 500);
  }
};


// Get all stakeholders 
export const getAllStakeholders = async (): Promise<IStakeholder[]> => {
  const allStakeholders = await Stakeholder.find().select('-createdAt -updatedAt -__v'); // Fetch all stakeholders excluding specific fields

  // Not Found Stakeholder
  if (allStakeholders.length === 0) {
    throw new StakeholderNotFoundError();
  }

  return allStakeholders;
};


// Get stakeholders by ID
export const getStakeholdersById = async (
  stakeholderId: string,
): Promise<IStakeholder | null> => {
  try {
    const stakeholder = await Stakeholder.findById(stakeholderId).select('-createdAt -updatedAt -__v');
    if (!stakeholder) {
      throw new Error('Stakeholder not found');
    }
    return stakeholder.toObject();
  } catch (error) {
    // Handle error here if needed
    throw new CustomError('Internal Server Error', 500);
  }
};

export const fetchStakeholders = async (
  stakeholderIds: ObjectId[],
): Promise<IStakeholder[]> => {
  if (stakeholderIds.length > 0) {
    const stakeholdersResults = await Promise.all(
      stakeholderIds.map((stakeholderId) => getStakeholdersById(stakeholderId.toString())),
    );
    return stakeholdersResults.filter(
      (stakeholder): stakeholder is IStakeholder => stakeholder !== null,
    );
  }
  return [];
};


export const fetchStakeholdersForSearch = async (
  stakeholderNames: string[],  
): Promise<ObjectId[]> => {
  console.log("Searching for stakeholder names: ", stakeholderNames);
  
  if (stakeholderNames && stakeholderNames.length > 0) {
    // Find stakeholders by names
    const stakeholders = await Stakeholder.find({
      type: { $in: stakeholderNames.map(type => new RegExp('^' + type + '$', 'i')) } 
    }).select('-createdAt -updatedAt -__v');

    console.log("Found stakeholders: ", stakeholders);
    if (stakeholders.length > 0) {
      
      return stakeholders.map(stakeholder => (stakeholder._id as unknown) as ObjectId); // Return the stakeholder IDs
    }
  }
  
  return []; // no stakeholders found
};
