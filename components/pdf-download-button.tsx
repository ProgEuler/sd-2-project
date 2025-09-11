"use client"

import { Button } from "@/components/ui/button"
import { generatePermissionSlipPDF } from "@/lib/pdf-generator"
import { Download, FileText } from "lucide-react"

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

interface PDFDownloadButtonProps {
  permissionSlip: PermissionSlipData
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showIcon?: boolean
}

export function PDFDownloadButton({
  permissionSlip,
  variant = "outline",
  size = "sm",
  showIcon = true,
}: PDFDownloadButtonProps) {
  const handleDownload = () => {
    generatePermissionSlipPDF(permissionSlip)
  }

  return (
    <Button variant={variant} size={size} onClick={handleDownload}>
      {showIcon && <Download className="h-4 w-4 mr-2" />}
      Download PDF
    </Button>
  )
}

interface BulkPDFButtonProps {
  permissionSlips: PermissionSlipData[]
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function BulkPDFButton({ permissionSlips, variant = "default", size = "default" }: BulkPDFButtonProps) {
  const handleBulkDownload = async () => {
    generateBulkPDF(permissionSlips)
  }

  return (
    <Button variant={variant} size={size} onClick={handleBulkDownload}>
      <FileText className="h-4 w-4 mr-2" />
      Download All PDFs
    </Button>
  )
}
