
import { body } from 'express-validator';
import Stakeholder from '@schemas/stakeholder.schema';

export const validateNewStakeholderType = [
  body('newStakeholderType')
    .custom(async (value, { req }) => {
      const type = req.body.type;
      
     
      if (type === 'New') {
        if (!value || value.trim() === '') {   // If 'type' is 'New', 'newStakeholderType' cannotbe  empty.
          throw new Error('New stakeholder type cannot be empty when "New" is selected.');
        }
         //check new stakeholder not exists in DB
        const existingStakeholder = await Stakeholder.findOne({ type: { $regex: new RegExp(`^${value.trim()}$`, 'i') }, });
        if (existingStakeholder) {
          throw new Error('The stakeholder type already exists.');
        }
      } else {
        // If 'type' is not 'New', 'newStakeholderType' should be empty (not shown at all).
        if (value && value.trim() !== '') {
          throw new Error('newStakeholderType should be empty if type is not "New".');
        }
      }
      return true;
    }),
];
