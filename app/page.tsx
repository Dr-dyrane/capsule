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
            <div className="preview-card surface-1 glass">
              <div className="card-mock-image" style={{ background: 'linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)' }}></div>
              <div className="card-mock-title">Pathophysiology</div>
            </div>
            <div className="preview-card surface-1 glass elevated">
              <div className="card-mock-image" style={{ background: 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)' }}></div>
              <div className="card-mock-title">Mechanism of Action</div>
            </div>
            <div className="preview-card surface-1 glass">
              <div className="card-mock-image" style={{ background: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)' }}></div>
              <div className="card-mock-title">Dermatology</div>
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
    </main>
  )
}
