export interface DotImageType {
  src: string
  color: string
  fontWeight: number | string
  onload: Function
  bgColor: string
  direction: Direction
}

export type Direction = 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse'

export type MaybeElement = string | HTMLElement
