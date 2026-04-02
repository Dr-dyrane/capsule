'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadNote } from '@/app/actions/upload'
import { Button } from '@/components/ui/Button'
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

      <style jsx>{`
        .page-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: var(--space-48);
        }
        
        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-24);
        }
        
        .upload-card {
          aspect-ratio: 1/1;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: transform var(--duration-micro) var(--ease-apple),
                      background-color var(--duration-micro) var(--ease-standard);
          position: relative;
        }
        
        .upload-card:hover {
          background-color: var(--surface-2);
        }
        
        .upload-card:active {
          transform: scale(0.97);
        }
        
        .hidden-input {
          display: none;
        }
        
        .icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-16);
        }
        
        .icon-circle.accent {
          background-color: var(--accent);
          color: white;
        }
        
        .upload-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-20);
          z-index: 2000;
          background: rgba(0,0,0,0.8);
        }
        
        .spinner {
          animation: spin 1s linear infinite;
          color: var(--accent);
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 500px) {
          .upload-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
