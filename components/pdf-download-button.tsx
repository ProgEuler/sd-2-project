"use client"

import { Button } from "@/components/ui/button"
import { FileDownIcon } from "lucide-react"
import { generatePdf } from "@/lib/pdf-generator"
import { toast } from "sonner"
import { PermissionRequestData, DashboardUser } from "@/app/dashboard/actions"

interface PDFDownloadButtonProps {
  request: PermissionRequestData;
  user: DashboardUser;
}

export function PDFDownloadButton({ request, user }: PDFDownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const pdfBlob = await generatePdf(request, user)
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `permission_slip_${request.id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Permission slip downloaded.")
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      toast.error("Failed to download permission slip.")
    }
  }

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <FileDownIcon className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  )
}