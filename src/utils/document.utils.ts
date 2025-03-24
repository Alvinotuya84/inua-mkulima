export const formatDocumentContent = (text: string): string => {
  return text
    .replace(/\s+/g, " ") // Remove excessive spaces
    .replace(/(\r\n|\n|\r)/g, "\n") // Normalize line breaks
    .trim(); // Trim leading and trailing spaces
};
