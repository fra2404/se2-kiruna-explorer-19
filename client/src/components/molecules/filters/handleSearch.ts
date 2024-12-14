import API from "../../../API";
import { IDocument } from "../../../utils/interfaces/document.interface";
import mongoose from "mongoose";

export const handleSearch: (
  filters: {
    type: string;
    stakeholders: string[];
    coordinates: string;
    year: string;
    month: string;
    day: string;
    language: string;
    scale: string;
    architecturalScale: string;
  },
  searchQuery: string,
  setDocuments: (documents: IDocument[]) => void,
  showToast: (message: string, type: 'success' | 'error') => void
  ) => void = async (
    filters,
    searchQuery,
    setFilteredDocuments,
    showToast
  ) => {
  let date = '';

  if (filters.year && filters.month && filters.day) {
    date = `${filters.year}-${filters.month}-${filters.day}`;
  } else if (filters.year && filters.month) {
    date = `${filters.year}-${filters.month}`;
  } else if (filters.year) {
    date = filters.year;
  } else {
    date = '';
  }

  if (isNotValidateArchitecturalScale(filters)) {
    showToast('Invalid architectural scale', 'error');
    return;
  }
  if (!isValidateCoordinates(filters)) {
    showToast('Invalid coordinates', 'error');
    return;
  }
  let wellFormedFilters = {
    type: filters.type || undefined,
    stakeholders: filters.stakeholders || undefined,
    coordinates: filters.coordinates || undefined,
    date: date || undefined,
    language: filters.language || undefined,
    scale: filters.scale || undefined,
    architecturalScale: filters.scale == 'ARCHITECTURAL' ? filters.architecturalScale : undefined,
  };
  setFilteredDocuments(await API.searchDocuments(searchQuery, wellFormedFilters));
};

const isNotValidateArchitecturalScale: (
  filters: {
    type: string;
    stakeholders: string[];
    coordinates: string;
    year: string;
    month: string;
    day: string;
    language: string;
    scale: string;
    architecturalScale: string;
  }
) => boolean = (filters) => {
  return (
    filters.scale === 'ARCHITECTURAL' &&
    ((filters.architecturalScale ?? '').trim() === '' ||
      !/^1:\d+$/.test(filters.architecturalScale ?? ''))
  );
}

const isValidateCoordinates: (
  filters: {
    type: string;
    stakeholders: string[];
    coordinates: string;
    year: string;
    month: string;
    day: string;
    language: string;
    scale: string;
    architecturalScale: string;
  }
) => boolean = (filters) => {
  return filters.coordinates === "" || mongoose.Types.ObjectId.isValid(filters.coordinates);
};