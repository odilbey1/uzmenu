'use client'

import { useEffect, useRef, useState } from 'react'
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react'

export default function QRCodeGenerator({
  slug,
  restaurantName,
  baseUrl,
}: {
  slug: string
  restaurantName: string
  baseUrl: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const menuUrl = `${baseUrl}/r/${slug}`

  useEffect(() => {
    async function generateQR() {
      const QRCode = (await import('qrcode')).default
      const canvas = canvasRef.current
      if (!canvas) return

      await QRCode.toCanvas(canvas, menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      })
    }
    generateQR()
  }, [menuUrl])

  function downloadQR() {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `qr-${slug}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          QR kod
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          QR kodni yuklab oling va stollarga joylashtiring
        </p>
      </div>

      {/* QR Code Card */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-8 shadow-sm text-center">
        <div className="inline-block p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-6">
          <canvas ref={canvasRef} className="mx-auto rounded-xl" />
        </div>

        <h3 className="font-bold text-lg text-stone-900 mb-1">
          {restaurantName}
        </h3>

        <div className="flex items-center justify-center gap-2 text-sm text-stone-500 mb-6">
          <QrCode className="w-4 h-4" />
          <code className="text-orange-600 font-medium">{menuUrl}</code>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={downloadQR}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all shadow-sm shadow-orange-500/25 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            QR kodni yuklab olish
          </button>

          <button
            onClick={copyUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                Nusxalandi!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Havolani nusxalash
              </>
            )}
          </button>

          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Ochish
          </a>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-orange-50 border border-orange-200/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-orange-900 mb-2">
          💡 Maslahat
        </h3>
        <ul className="text-xs text-orange-800 space-y-1.5">
          <li>• QR kodni yuklab olib, har bir stolga chop eting.</li>
          <li>• Mijozlar telefonlari bilan skaner qilganda menyu brauzerda ochiladi.</li>
          <li>• Menyuni yangilasangiz, QR kod o'zgarmaydi — doim bir xil havola.</li>
        </ul>
      </div>
    </div>
  )
}
