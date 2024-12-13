import { IStakeholder } from '@interfaces/stakeholder.interface';
import mongoose, { Schema } from 'mongoose';

export type StakeholderDocument = IStakeholder & Document;

const stakeholderSchema = new Schema<StakeholderDocument>(
  {
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

stakeholderSchema.index({ type: 1 });
export default mongoose.model<StakeholderDocument>('Stakeholder', stakeholderSchema);
