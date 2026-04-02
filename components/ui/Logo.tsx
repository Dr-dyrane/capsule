import styles from './Logo.module.css'

export type LogoProps = {
  size?: number | string
  className?: string
  showText?: boolean
}

/**
 * A "Liquid Glass" Logo component using a squircle-based card capsule design.
 * Per Alexander UI Canon: Borderless, depth-through-layers, and premium feel.
 */
export default function Logo({ size = 32, className, showText = false }: LogoProps) {
  return (
    <div 
      className={`${styles.container} ${showText ? styles.withText : ''} ${className || ''}`}
    >
      <div className={styles.iconBox} style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 512 512" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
        >
        <defs>
          <linearGradient id="liquid-blue" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A84FF" />
            <stop offset="1" stopColor="#0040FF" stopOpacity="0.8" />
          </linearGradient>
          
          <linearGradient id="glass-glare" x1="256" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.12" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="logo-drop" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feOffset dx="0" dy="8" result="offsetBlur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
        </defs>

        {/* Main Squircle Container */}
        <path 
          d="M170.667 0H341.333C456.533 0 512 55.4667 512 170.667V341.333C512 456.533 456.533 512 341.333 512H170.667C55.4667 512 0 456.533 0 341.333V170.667C0 55.4667 55.4667 0 170.667 0Z" 
          fill="var(--canvas, #000)" 
        />
        
        {/* Liquid Base (Full Squircle Fill with Gradient) */}
        <path 
          d="M170.667 0H341.333C456.533 0 512 55.4667 512 170.667V341.333C512 456.533 456.533 512 341.333 512H170.667C55.4667 512 0 456.533 0 341.333V170.667C0 55.4667 55.4667 0 170.667 0Z" 
          fill="url(#liquid-blue)" 
          fillOpacity="0.9"
        />

        {/* Glass Glare Layer (Top Half) */}
        <path 
          d="M170.667 0H341.333C456.533 0 512 55.4667 512 170.667V256H0V170.667C0 55.4667 55.4667 0 170.667 0Z" 
          fill="url(#glass-glare)" 
        />

        {/* Refraction Accent (Bottom Edge) */}
        <path 
          d="M170.667 480H341.333C456.533 480 500 440 500 341.333H512V341.333C512 456.533 456.533 512 341.333 512H170.667C55.4667 512 0 456.533 0 341.333H12C12 440 55.4667 480 170.667 480Z" 
          fill="white" 
          fillOpacity="0.08" 
        />
      </svg>
      </div>
      {showText && <span className={styles.text}>Capsule</span>}
    </div>
  )
}
