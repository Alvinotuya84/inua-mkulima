export async function processDocuments(files: File[], clientId: string) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("clientId", clientId);

  try {
    const response = await fetch("/api/documents/process", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process documents");
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing documents:", error);
    throw error;
  }
}

export async function generateMasterDocument(
  documentIds: string[],
  clientId: string
) {
  try {
    const response = await fetch("/api/documents/master", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentIds,
        clientId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate master document");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating master document:", error);
    throw error;
  }
}
