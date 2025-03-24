export const formDataToObject = (formData: FormData) => {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    // Handle file objects specially
    if (value instanceof File) {
      obj[key] = value;
    } else {
      obj[key] = value;
    }
  }
  return obj;
};
