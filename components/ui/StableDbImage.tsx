import Image, { type ImageProps } from 'next/image'

import { getStableDbImagePath, type StableDbImageKind } from '@/lib/assets/stable-image-paths'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'

type StableDbImageProps = Omit<ImageProps, 'src' | 'placeholder' | 'blurDataURL' | 'alt'> & {
  kind: StableDbImageKind
  id: string
  alt: string
}

export default function StableDbImage({ kind, id, ...props }: StableDbImageProps) {
  const { alt, ...imageProps } = props

  return (
    <Image
      {...imageProps}
      alt={alt}
      src={getStableDbImagePath(kind, id)}
      placeholder="blur"
      blurDataURL={APP_IMAGE_BLUR_DATA_URL}
    />
  )
}
