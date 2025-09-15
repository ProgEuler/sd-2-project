import jsPDF from "jspdf";
import logo from "@/public/nub-logo.png"
import seal from "@/public/approved.png"

interface User {
  name?: string;
  studentId?: string;
  email?: string;
  department?: string;
  semester?: string;
}

interface Request {
  id: string;
  requestType: string;
  subject: string;
  reason: string;
  status: string;
  submittedAt: string;
}

export async function generatePdf(request: Request, user: User): Promise<Blob> {
  const doc = new jsPDF();

  // Page dimensions and margins
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let currentY = 20;

  // ===== HEADER SECTION =====
  function addHeader() {

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

   doc.addImage(seal.src, "PNG", 20, 30, 40, 20, undefined, undefined, 30);
   doc.addImage(logo.src, "PNG", 60, 20, 80, 20)

    currentY += 35;
    doc.setFontSize(12);
    doc.text("PERMISSION SLIP", pageWidth / 2, currentY, { align: "center" });

    // Decorative line under header
    currentY += 8;
    doc.setLineWidth(0.8);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
  }

  // ===== DOCUMENT INFO SECTION =====
  function addDocumentInfo() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Request ID and Date in header area
    const dateStr = new Date(request.submittedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.text(`Request ID: ${request.id}`, margin, currentY);
    doc.text(`Date: ${dateStr}`, pageWidth - margin, currentY, { align: "right" });

    currentY += 20;
  }

  // ===== STUDENT INFORMATION SECTION =====
  function addStudentInfo() {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("STUDENT INFORMATION", margin, currentY);

    currentY += 10;
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, margin + 60, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const infoItems = [
      { label: "Name:", value: user.name || "________________" },
      { label: "Student ID:", value: user.studentId || "________________" },
      { label: "Email:", value: user.email || "________________" },
      { label: "Department:", value: user.department || "________________" },
      { label: "Semester:", value: user.semester || "________________" },
    ];

    infoItems.forEach(item => {
      doc.setFont("helvetica", "bold");
      doc.text(item.label, margin + 5, currentY);

      doc.setFont("helvetica", "normal");
      const labelWidth = doc.getTextWidth(item.label);
      doc.text(item.value, margin + 5 + labelWidth + 5, currentY);

      currentY += 8;
    });

    currentY += 10;
  }

  // ===== REQUEST DETAILS SECTION =====
  function addRequestDetails() {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("REQUEST DETAILS", margin, currentY);

    currentY += 10;
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, margin + 50, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Request Type
    doc.setFont("helvetica", "bold");
    doc.text("Request Type:", margin + 5, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(request.requestType, margin + 5 + doc.getTextWidth("Request Type:") + 5, currentY);
    currentY += 10;

    // Subject
    doc.setFont("helvetica", "bold");
    doc.text("Subject:", margin + 5, currentY);
    doc.setFont("helvetica", "normal");
    const subjectLines = doc.splitTextToSize(request.subject, contentWidth - 60);
    doc.text(subjectLines, margin + 5 + doc.getTextWidth("Subject:") + 5, currentY);
    currentY += subjectLines.length * 6 + 5;
    currentY += 5;
  }

  // ===== REASON SECTION =====
  function addReason() {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("REASON FOR REQUEST", margin, currentY);

    currentY += 10;
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, margin + 60, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const reasonLines = doc.splitTextToSize(request.reason, contentWidth - 10);
    doc.text(reasonLines, margin + 5, currentY);
    currentY += reasonLines.length * 6 + 15;
  }

  // ===== APPROVAL SECTION =====
  function addApprovalSection() {
    currentY += 10;
    doc.setLineWidth(0.3);
    currentY += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    currentY += 25;

    // Signature section
    const signatureY = Math.max(currentY, pageHeight - 80);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("(Head of Department)", pageWidth - margin - 80, signatureY + 15);
  }

  // ===== FOOTER =====
  function addFooter() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);

    const footerText = "This is an official document. Please keep it safe for your records.";
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);
  }

  // ===== GENERATE PDF =====
  addHeader();
  addDocumentInfo();
  addStudentInfo();
  addRequestDetails();
  addReason();
  addApprovalSection();
  addFooter();

  return doc.output("blob");
}

// ===== UTILITY FUNCTIONS =====

// Function to add a border around the entire document
export function generatePdfWithBorder(request: Request, user: User): Promise<Blob> {
  return generatePdf(request, user).then(blob => {
    // This would require additional processing to add a border
    // For now, returning the standard PDF
    return blob;
  });
}

// Function to generate PDF with custom styling
export function generateStyledPdf(
  request: Request,
  user: User,
  options?: {
    primaryColor?: [number, number, number];
    fontSize?: number;
    fontFamily?: string;
    includeHeader?: boolean;
    includeBorder?: boolean;
  }
): Promise<Blob> {
  // This could be extended to include custom styling options
  return generatePdf(request, user);
}
