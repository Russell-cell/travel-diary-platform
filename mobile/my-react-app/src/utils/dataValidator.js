// src/utils/dataValidator.js
export const validateWaterfallData = (data) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data type:', typeof data);
      return [];
    }
    return data.filter(item => 
      item?.id !== undefined && 
      typeof item.cover === 'string' &&
      typeof item.title === 'string'
    );
  };