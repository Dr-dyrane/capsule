'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import styles from './ImagePreview.module.css'

interface ImagePreviewProps {
  src: string
  alt: string
  variant?: 'card' | 'document'
}

export default function ImagePreview({ src, alt, variant = 'card' }: ImagePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isDocument = variant === 'document'

  // Prevent scrolling when full screen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  return (
    <>
      <div
        className={`${styles.container} ${isDocument ? styles.documentContainer : ''}`}
        onClick={() => setIsFullscreen(true)}
        role="button"
        tabIndex={0}
        aria-label="View full screen"
        onKeyDown={(e) => e.key === 'Enter' && setIsFullscreen(true)}
      >
        <div className={styles.frame}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1023px) 100vw, 60vw"
            quality={80}
            placeholder="blur"
            blurDataURL={APP_IMAGE_BLUR_DATA_URL}
            className={`${styles.image} ${isDocument ? styles.documentImage : ''}`}
          />
        </div>
        <div className={styles.overlay}>
          <ZoomIn size={24} />
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={styles.fullscreenOverlay}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.985, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.985, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={styles.fullscreenContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${styles.fullscreenImageWrap} ${isDocument ? styles.documentFullscreenImageWrap : ''}`}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="100vw"
                  quality={86}
                  placeholder="blur"
                  blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                  className={`${styles.fullscreenImage} ${isDocument ? styles.documentFullscreenImage : ''}`}
                />
              </div>

              <button 
                className={styles.closeButton}
                onClick={() => setIsFullscreen(false)}
                aria-label="Close full screen"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
