"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Share } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRCodeDisplayProps {
  qrCode: string
  publicKey: string
}

export function QRCodeDisplay({ qrCode, publicKey }: QRCodeDisplayProps) {
  const { toast } = useToast()

  const copyAddress = () => {
    navigator.clipboard.writeText(publicKey)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const downloadQR = () => {
    const link = document.createElement("a")
    link.download = `wallet-qr-${publicKey.substring(0, 8)}.svg`
    link.href = qrCode
    link.click()

    toast({
      title: "QR Code Downloaded",
      description: "QR code saved to your device",
    })
  }

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wallet QR Code",
          text: `Send funds to: ${publicKey}`,
          url: qrCode,
        })
      } catch (error) {
        copyAddress()
      }
    } else {
      copyAddress()
    }
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <img
            src={qrCode || "/placeholder.svg"}
            alt="Wallet QR Code"
            className="w-48 h-48 mx-auto border rounded-lg"
          />
        </div>

        <div className="space-y-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Scan to Send Funds
          </Badge>

          <p className="text-sm text-gray-600">Scan this QR code with any Solana wallet to send funds</p>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={copyAddress} className="flex-1">
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button size="sm" variant="outline" onClick={downloadQR} className="flex-1">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={shareQR} className="flex-1">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
