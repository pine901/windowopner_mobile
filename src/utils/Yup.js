// Just return the function for YUP
export const errorMessage = (key, message) => {
  // Return function
  return params => {
    return {[key]: message};
  };
};
