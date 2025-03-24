import { jsPDF } from "jspdf";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

// Load the DOCX template - you'll need to create this
const templatePath = "/templates/document-template.docx";

export async function exportToPDF(
  markdown: string,
  filename: string = "document.pdf"
) {
  const doc = new jsPDF();

  // Convert markdown to clean text for PDF
  const cleanText = markdown
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*/g, "") // Remove bold
    .replace(/\*/g, "") // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // Replace links with text

  const pageWidth = doc.internal.pageSize.width - 20;
  const lines = doc.splitTextToSize(cleanText, pageWidth);
  let y = 10;

  lines.forEach((line) => {
    if (y > doc.internal.pageSize.height - 10) {
      doc.addPage();
      y = 10;
    }
    doc.text(line, 10, y);
    y += 7;
  });

  return doc.save(filename);
}

export async function exportToWord(
  markdown: string,
  filename: string = "document.docx"
) {
  try {
    // Fetch the template
    const response = await fetch(templatePath);
    const templateContent = await response.arrayBuffer();

    // Create a new zip instance with the template content
    const zip = new PizZip(templateContent);

    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Convert markdown to sections
    const sections = markdown.split("\n\n").map((section) => {
      return { content: section.trim() };
    });

    // Render the document with data
    doc.render({
      date: new Date().toLocaleDateString(),
      sections: sections,
    });

    // Generate output
    const output = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Create download link
    const url = URL.createObjectURL(output);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export to Word failed:", error);
    throw error;
  }
}
