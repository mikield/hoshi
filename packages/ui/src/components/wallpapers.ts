export type WallpaperType = 'svg' | 'symbol' | 'aurora' | 'shader' | 'image'

export interface Wallpaper {
  id: string
  name: string
  type: WallpaperType
  svgUrl?: string
  symbolUrl?: string
  lightUrl?: string
  darkUrl?: string
  thumbnailUrl: string
}

export const DEFAULT_WALLPAPER_ID = 'brandmark'

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'brandmark',
    name: 'Brandmark',
    type: 'svg',
    svgUrl: '/hoshi-brandmark-bg.svg',
    thumbnailUrl: '/hoshi-brandmark-bg.svg',
  },
  {
    id: 'symbol',
    name: 'Symbol',
    type: 'symbol',
    symbolUrl: '/hoshi-symbol.svg',
    thumbnailUrl: '/hoshi-symbol.svg',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    type: 'aurora',
    svgUrl: '/hoshi-logomark-white.svg',
    thumbnailUrl: '/hoshi-logomark-white.svg',
  },
  {
    id: 'nebula',
    name: 'Pixel Beams',
    type: 'shader',
    svgUrl: '/hoshi-logomark-white.svg',
    thumbnailUrl: '/hoshi-logomark-white.svg',
  },
  {
    id: 'ascii-tunnel',
    name: 'ASCII Tunnel',
    type: 'shader',
    svgUrl: '/hoshi-logomark-white.svg',
    thumbnailUrl: '/hoshi-logomark-white.svg',
  },
  {
    id: 'matrix',
    name: 'Enter the Matrix',
    type: 'shader',
    svgUrl: '/hoshi-logomark-white.svg',
    thumbnailUrl: '/hoshi-logomark-white.svg',
  },
]

export function getWallpaperById(id: string): Wallpaper {
  return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0]
}
