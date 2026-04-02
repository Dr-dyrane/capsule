import Link from 'next/link'

export default function MarketingPage() {
  return (
    <main className="marketing-container animate-fade-in">
      <nav className="marketing-nav glass">
        <div className="logo title-2">Capsule</div>
        <Link href="/login" className="login-link subhead">Login</Link>
      </nav>

      <section className="hero">
        <div className="hero-content animate-slide-up">
          <h1 className="title-large hero-title">Distill notes into visual knowledge.</h1>
          <p className="subhead hero-subtitle">Transform your pharmacy notes into beautiful, illustrative learning cards in seconds.</p>
          
          <Link href="/login" className="cta-button accent">
            Get Started
          </Link>
        </div>

        <div className="hero-visual animate-fade-in">
          <div className="visual-card-shelf">
            {/* These would be real generated cards from the library */}
            <div className="preview-card surface-1 glass">
              <div className="card-mock-image" style={{ background: 'linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)' }}></div>
              <div className="card-mock-title frosted">Pathophysiology</div>
            </div>
            <div className="preview-card surface-1 glass elevated">
              <div className="card-mock-image" style={{ background: 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)' }}></div>
              <div className="card-mock-title frosted">Mechanism of Action</div>
            </div>
            <div className="preview-card surface-1 glass">
              <div className="card-mock-image" style={{ background: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)' }}></div>
              <div className="card-mock-title frosted">Dermatology</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-block surface-1 glass">
          <div className="feature-icon">📸</div>
          <p className="subhead">Scan Notes</p>
        </div>
        <div className="feature-block surface-1 glass">
          <div className="feature-icon">🧠</div>
          <p className="subhead">AI Points</p>
        </div>
        <div className="feature-block surface-1 glass">
          <div className="feature-icon">🗂️</div>
          <p className="subhead">Smart Library</p>
        </div>
      </section>

      <style jsx>{`
        .marketing-container {
          min-height: 100vh;
          background-color: var(--canvas);
          color: white;
          padding: var(--space-24);
          max-width: 1200px;
          margin: 0 auto;
        }

        .marketing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-20) 0;
          margin-bottom: var(--space-64);
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-64);
          padding-bottom: var(--space-64);
        }

        .hero-content {
          max-width: 700px;
        }

        .hero-title {
          font-size: clamp(34px, 8vw, 64px);
          margin-bottom: var(--space-24);
        }

        .hero-subtitle {
          font-size: 20px;
          margin-bottom: var(--space-40);
        }

        .cta-button {
          display: inline-block;
          padding: var(--space-16) var(--space-32);
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 17px;
          background-color: var(--accent);
          color: white;
          transition: transform var(--duration-micro) var(--ease-apple),
                      background-color var(--duration-micro) var(--ease-standard);
        }

        .cta-button:hover {
          background-color: var(--accent-hover);
          transform: scale(1.05);
        }

        .hero-visual {
          width: 100%;
          overflow: hidden;
          padding: var(--space-24) 0;
        }

        .visual-card-shelf {
          display: flex;
          justify-content: center;
          gap: var(--space-24);
          transform: perspective(1000px) rotateX(10deg);
        }

        .preview-card {
          width: 240px;
          aspect-ratio: 4/5;
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-lg);
          transition: transform var(--duration-dramatic) var(--ease-apple);
        }

        .preview-card.elevated {
          transform: translateY(-32px) scale(1.1);
          z-index: 2;
        }

        .card-mock-image {
          width: 100%;
          height: 100%;
        }

        .card-mock-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-12);
          font-size: 13px;
          font-weight: 600;
        }

        .frosted {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-24);
          margin-top: var(--space-64);
        }

        .feature-block {
          padding: var(--space-32);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: var(--space-16);
        }

        @media (max-width: 767px) {
          .features {
            grid-template-columns: 1fr;
          }
          .visual-card-shelf {
            transform: none;
          }
          .preview-card:not(.elevated) {
            display: none;
          }
        }
      `}</style>
    </main>
  )
}
