import { memorizeFn, useRic } from 'lazy-js-utils'
import type { Direction } from './types'

export class DotImageCanvas {
  canvas: HTMLCanvasElement = document.createElement('canvas')
  ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!
  points: Map<string, Record<string, any>> = new Map()
  originSrc = ''
  color = ''
  fontWeight = 1
  status = 'pending'
  bgColor?: string
  direction: Direction = 'horizontal'
  constructor(src: string, color: string, fontWeight: number, bgColor = '#fff', direction?: Direction) {
    this.initOptions(src, color, fontWeight, bgColor, direction)
    this.executor()
  }

  createDotImage(img: HTMLImageElement) {
    this.canvas.width = img.width
    this.canvas.height = img.height
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
    const { data: imageData, width, height } = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const imagePointSet: number[][] = []
    for (let i = 0; i < height; i++) {
      const temp: any[] = []
      imagePointSet.push(temp)
      for (let j = 0; j < width; j++) {
        const pxStartIndex = (i * width * 4 + j * 4)
        const pxData = {
          r: imageData[pxStartIndex],
          g: imageData[pxStartIndex + 1],
          b: imageData[pxStartIndex + 2],
          a: imageData[pxStartIndex + 3],
        }
        const color = `rgba(${pxData.r},${pxData.g},${pxData.b},${pxData.a})`
        if (pxData.r > 230 && pxData.g > 230 && pxData.b > 230)
          temp.push(this.color ? 0 : this.bgColor)
        else
          temp.push(pxData.a ? color : 0)
      }
    }

    this.points.set(this.originSrc, { width: this.canvas.width, imagePointSet, height: this.canvas.height })
    return imagePointSet
  }

  createImage() {
    if (this.hasImage()) {
      const { imagePointSet, width, height } = this.points.get(this.originSrc) as Record<string, any>
      const pRatio = window.devicePixelRatio || 1
      this.canvas.width = width * pRatio
      this.canvas.height = height * pRatio
      this.getCanvas(imagePointSet)
      return
    }
    const img = new Image()
    return new Promise((resolve) => {
      img.setAttribute('crossorigin', 'anonymous')
      img.src = this.originSrc
      img.onload = () => {
        this.getCanvas(this.createDotImage(img))
        resolve(img)
      }
      img.onerror = () => {
        this.status = 'fail'
        // reject(new Error('create image error'))
      }
    })
  }

  hasImage() {
    return this.points.has(this.originSrc)
  }

  async executor() {
    try {
      this.createImage()
    }
    catch (error) {
    }
    return this
  }

  getCanvas(imagePointSet: Array<number[]>) {
    this.clearCanvas()
    const h = imagePointSet.length
    const w = imagePointSet[0]?.length
    const oneTempLength = this.canvas.width * 1 / h
    const size = this.fontWeight * 50 / this.canvas.width
    const getPoint = memorizeFn((i: number) => oneTempLength * (i + 0.5))
    const tasks: Function[] = []
    // if (this.direction !== 'horizontal')
    //   debugger
    if (this.direction === 'horizontal-reverse') {
      for (let i = h - 1; i >= 0; i--) {
        tasks.push(() => {
          for (let j = w - 1; j >= 0; j--) {
            const color = imagePointSet[i][j]
            if (color) {
              this.ctx.beginPath()
              this.ctx.arc(getPoint(j), getPoint(i), size, 0, Math.PI * 2)
              this.ctx.fillStyle = this.color || `${color}`
              this.ctx.fill()
            }
          }
        })
      }
    }
    else if (this.direction === 'horizontal') {
      for (let i = 0; i < h; i++) {
        tasks.push(() => {
          for (let j = 0; j < w; j++) {
            const color = imagePointSet[i][j]
            if (color) {
              this.ctx.beginPath()
              this.ctx.arc(getPoint(j), getPoint(i), size, 0, Math.PI * 2)
              this.ctx.fillStyle = this.color || `${color}`
              this.ctx.fill()
            }
          }
        })
      }
    }
    else if (this.direction === 'vertical') {
      for (let j = 0; j < w; j++) {
        tasks.push(() => {
          for (let i = 0; i < h; i++) {
            const color = imagePointSet[i][j]
            if (color) {
              this.ctx.beginPath()
              this.ctx.arc(getPoint(j), getPoint(i), size, 0, Math.PI * 2)
              this.ctx.fillStyle = this.color || `${color}`
              this.ctx.fill()
            }
          }
        })
      }
    }
    else if (this.direction === 'vertical-reverse') {
      for (let j = w - 1; j >= 0; j--) {
        tasks.push(() => {
          for (let i = h - 1; i >= 0; i--) {
            const color = imagePointSet[i][j]
            if (color) {
              this.ctx.beginPath()
              this.ctx.arc(getPoint(j), getPoint(i), size, 0, Math.PI * 2)
              this.ctx.fillStyle = this.color || `${color}`
              this.ctx.fill()
            }
          }
        })
      }
    }

    useRic(tasks, {
      callback: () => {
        this.status = 'success'
      },
    })
  }

  initOptions(src: string, color: string, fontWeight: number, bgColor: string, direction: Direction = 'horizontal') {
    this.originSrc = src
    this.color = color
    this.fontWeight = fontWeight
    this.bgColor = bgColor
    this.direction = direction
  }

  async repaint(src: string, color: string, fontWeight: number, bgColor = '#fff') {
    this.status = 'pending'
    this.initOptions(src, color, fontWeight, bgColor)
    return this.executor()
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

