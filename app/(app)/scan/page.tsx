'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadNote } from '@/app/actions/upload'
import { Camera, Upload, Loader2 } from 'lucide-react'

export default function ScanPage() {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const session = await uploadNote(formData)
      router.push(`/scan/${session.id}`)
    } catch (error) {
      console.error(error)
      alert('Upload failed. Please try again.')
      setIsUploading(false)
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1 className="title-large">Scan</h1>
        <p className="subhead">Distill your medical notes into cards.</p>
      </header>
      
      <div className="upload-grid">
        <label className="upload-card glass surface-1 animate-slide-up">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleUpload} 
            disabled={isUploading}
            className="hidden-input"
          />
          <div className="upload-content">
            <div className="icon-circle accent">
              <Camera size={32} strokeWidth={2.5} />
            </div>
            <p className="title-2">Take Photo</p>
            <p className="caption">Use your camera to scan notes</p>
          </div>
        </label>

        <label className="upload-card glass surface-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={isUploading}
            className="hidden-input"
          />
          <div className="upload-content">
            <div className="icon-circle surface-2">
              <Upload size={32} strokeWidth={2.5} />
            </div>
            <p className="title-2">Upload File</p>
            <p className="caption">Select from your photo library</p>
          </div>
        </label>
      </div>

      {isUploading && (
        <div className="upload-overlay glass">
          <Loader2 className="spinner" size={48} />
          <p className="title-2">Uploading...</p>
        </div>
      )}
    </div>
  )
}
