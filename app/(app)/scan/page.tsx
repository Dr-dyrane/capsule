export default function ScanPage() {
  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1 className="title-large">Scan</h1>
      </header>
      
      <div className="upload-section">
        <div className="upload-zone glass surface-1 animate-slide-up">
          <div className="upload-content">
            <div className="upload-icon">+</div>
            <p className="title-2">Add Notes</p>
            <p className="subhead">Capture or upload medical notes</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: var(--space-32);
        }
        
        .upload-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-24);
        }
        
        .upload-zone {
          aspect-ratio: 4/3;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: transform var(--duration-micro) var(--ease-apple),
                      background-color var(--duration-micro) var(--ease-standard);
        }
        
        .upload-zone:hover {
          background-color: var(--surface-2);
        }
        
        .upload-zone:active {
          transform: scale(0.98);
        }
        
        .upload-icon {
          font-size: 48px;
          font-weight: 300;
          color: var(--accent);
          margin-bottom: var(--space-8);
        }
      `}</style>
    </div>
  )
}
