import jsPDF from "jspdf"

interface PermissionSlipData {
  id: string
  title: string
  description: string
  event_date: string
  event_location: string
  emergency_contact_name: string
  emergency_contact_phone: string
  status: string
  faculty_comments?: string
  reviewed_at?: string
  created_at: string
  student: {
    full_name: string
    student_id: string
    email: string
  }
  faculty_reviewer?: {
    full_name: string
    department: string
  }
}

export function generatePermissionSlipPDF(data: PermissionSlipData): void {
  const doc = new jsPDF()

  // University Header
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("NUB PERMISSION SLIP", 105, 25, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Official Document", 105, 35, { align: "center" })

  // Document ID and Date
  doc.setFontSize(10)
  doc.text(`Document ID: ${data.id}`, 20, 50)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 58)

  // Status Badge
  const statusColor =
    data.status === "approved" ? [34, 197, 94] : data.status === "rejected" ? [239, 68, 68] : [234, 179, 8]
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2])
  doc.roundedRect(150, 45, 40, 10, 2, 2, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text(data.status.toUpperCase(), 170, 52, { align: "center" })

  // Reset text color
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "normal")

  // Student Information Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("STUDENT INFORMATION", 20, 75)

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Name: ${data.student.full_name}`, 20, 88)
  doc.text(`Student ID: ${data.student.student_id}`, 20, 96)
  doc.text(`Email: ${data.student.email}`, 20, 104)

  // Event Information Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("EVENT INFORMATION", 20, 125)

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Event Title: ${data.title}`, 20, 138)
  doc.text(`Event Date: ${new Date(data.event_date).toLocaleDateString()}`, 20, 146)
  doc.text(`Location: ${data.event_location}`, 20, 154)

  // Description
  doc.text("Description:", 20, 167)
  const splitDescription = doc.splitTextToSize(data.description, 170)
  doc.text(splitDescription, 20, 175)

  // Emergency Contact Section
  const descriptionHeight = splitDescription.length * 8
  const emergencyY = 185 + descriptionHeight

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("EMERGENCY CONTACT", 20, emergencyY)

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Name: ${data.emergency_contact_name}`, 20, emergencyY + 13)
  doc.text(`Phone: ${data.emergency_contact_phone}`, 20, emergencyY + 21)

  // Review Information (if reviewed)
  if (data.status !== "pending" && data.reviewed_at) {
    const reviewY = emergencyY + 40

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("FACULTY REVIEW", 20, reviewY)

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Status: ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`, 20, reviewY + 13)
    doc.text(`Reviewed Date: ${new Date(data.reviewed_at).toLocaleDateString()}`, 20, reviewY + 21)

    if (data.faculty_reviewer) {
      doc.text(`Reviewed By: ${data.faculty_reviewer.full_name}`, 20, reviewY + 29)
      doc.text(`Department: ${data.faculty_reviewer.department}`, 20, reviewY + 37)
    }

    if (data.faculty_comments) {
      const splitComments = doc.splitTextToSize(data.faculty_comments, 170) // Declare splitComments variable
      doc.text("Comments:", 20, reviewY + 50)
      doc.text(splitComments, 20, reviewY + 58)
    }

    // Digital Signature Section (for approved documents)
    if (data.status === "approved") {
      const signatureY = reviewY + 80 + (data.faculty_comments ? splitComments.length * 8 : 0)

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("DIGITAL SIGNATURE", 20, signatureY)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("This document has been digitally signed and approved by authorized faculty.", 20, signatureY + 10)
      doc.text(`Signature Hash: ${generateSignatureHash(data)}`, 20, signatureY + 18)
      doc.text(`Verification Code: ${data.id.substring(0, 8).toUpperCase()}`, 20, signatureY + 26)
    }
  }

  // Footer
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text("This is an official NUB document. Please retain for your records.", 105, 280, { align: "center" })
  doc.text(`Submitted: ${new Date(data.created_at).toLocaleDateString()}`, 105, 288, { align: "center" })

  // Download the PDF
  const filename = `permission_slip_${data.student.student_id}_${data.id.substring(0, 8)}.pdf`
  doc.save(filename)
}

function generateSignatureHash(data: PermissionSlipData): string {
  // Simple hash generation for demonstration
  const signatureData = `${data.id}${data.status}${data.reviewed_at}${data.faculty_reviewer?.full_name}`
  let hash = 0
  for (let i = 0; i < signatureData.length; i++) {
    const char = signatureData.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, "0")
}

export function generateBulkPDF(permissionSlips: PermissionSlipData[]): void {
  const doc = new jsPDF()

  permissionSlips.forEach((slip, index) => {
    if (index > 0) {
      doc.addPage()
    }

    // Add individual permission slip content (simplified version)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("UNIVERSITY PERMISSION SLIP", 105, 25, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Student: ${slip.student.full_name} (${slip.student.student_id})`, 20, 50)
    doc.text(`Event: ${slip.title}`, 20, 60)
    doc.text(`Date: ${new Date(slip.event_date).toLocaleDateString()}`, 20, 70)
    doc.text(`Status: ${slip.status.toUpperCase()}`, 20, 80)

    if (slip.status === "approved") {
      doc.text(`Approved: ${new Date(slip.reviewed_at!).toLocaleDateString()}`, 20, 90)
      doc.text(`Signature Hash: ${generateSignatureHash(slip)}`, 20, 100)
    }
  })

  doc.save(`bulk_permission_slips_${new Date().toISOString().split("T")[0]}.pdf`)
}
