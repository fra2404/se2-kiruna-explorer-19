import Stakeholder from '../schemas/stakeholder.schema';
import { CustomError } from '@utils/customError';
import { IStakeholder } from '@interfaces/stakeholder.interface';

export const addingStakeholder = async (
    stakeholderData: any,
  ): Promise<IStakeholder> => {
    try {  
      // Step 5: Save metadata along with the CDN output in DB
      const stakeholder = new Stakeholder({
        type: stakeholderData.type ,
      });
  
      const NewStakeholder =  await stakeholder.save();
      return NewStakeholder;
    } catch (error) {
      //console.error('Error in uploadMediaService:', error);
      throw new CustomError('Internal Server Error', 500);
    }
  };
