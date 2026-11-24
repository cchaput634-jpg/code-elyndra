// A4 portrait at 96 dpi: 794 x 1123 px.
// We author at a larger size for crisp PDFs and scale the view with CSS.
export const PAGE_W = 794
export const PAGE_H = 1123

export const DEFAULT_BG = '/bg-parchemin.jpg'

export const BG_PRESETS = [
  { id: 'parchemin', label: 'Parchemin', url: '/bg-parchemin.jpg' },
]

export const FONTS = [
  { id: 'cinzel', label: 'Cinzel', stack: '"Cinzel", "Cormorant Garamond", serif' },
  { id: 'cormorant', label: 'Cormorant', stack: '"Cormorant Garamond", Georgia, serif' },
  { id: 'eb-garamond', label: 'EB Garamond', stack: '"EB Garamond", Georgia, serif' },
  { id: 'playfair', label: 'Playfair Display', stack: '"Playfair Display", serif' },
  { id: 'im-fell', label: 'IM Fell English', stack: '"IM Fell English", serif' },
  { id: 'pirata', label: 'Pirata One', stack: '"Pirata One", cursive' },
  { id: 'unifraktur', label: 'UnifrakturMaguntia', stack: '"UnifrakturMaguntia", cursive' },
]

export function fontStackOf(id) {
  return (FONTS.find((f) => f.id === id) || FONTS[0]).stack
}
