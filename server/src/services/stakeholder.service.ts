import Stakeholder from '../schemas/stakeholder.schema';
import { CustomError } from '@utils/customError';
import { IStakeholder } from '@interfaces/stakeholder.interface';
import { StakeholderNotFoundError } from '@utils/errors';


//Add new stakeholder
export const addingStakeholder = async (
    stakeholderData: any,
  ): Promise<IStakeholder> => {
    try {  
      // Step 5: Save metadata along with the CDN output in DB
      const stakeholder = new Stakeholder({
        type: stakeholderData.newStakeholderType ,
      });
  
      const NewStakeholder =  await stakeholder.save();
      return NewStakeholder;
    } catch (error) {
      //console.error('Error in uploadMediaService:', error);
      throw new CustomError('Internal Server Error', 500);
    }
  };


  // Get all stakeholders 
  export const getAllStakeholders = async (): Promise<IStakeholder[]> => {
    const Allstakeholders = await Stakeholder.find(); // Fetch all stakeholders
  
     // Not Found Stakeholder
  if (Allstakeholders.length === 0) {
    throw new StakeholderNotFoundError();
  }

       return Allstakeholders;
  };


// Get stakeholders by ID
export const getStakeholdersById = async (
  stakeholderId: string,
): Promise<IStakeholder | null> => {
  try {
    const stakeholder = await Stakeholder.findById(stakeholderId); 
    if (!stakeholder) {
      throw new Error('Stakeholder not found'); 
    }
    return stakeholder.toObject();
  } catch (error) {
    // Handle error here if needed
    throw new CustomError('Internal Server Error', 500);
  }
};
