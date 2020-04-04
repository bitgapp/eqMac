import { Injectable } from '@angular/core'

@Injectable()
export class UtilitiesService {
  constructor () { }

  mapValue (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }

  getImageFromSrcWhenLoaded (src) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'  // This enables CORS
      image.onload = () => resolve(image)
      image.onerror = () => reject(image)
      image.src = src
    })
  }

  getBackgroundImageSrcFromClass (className: string) {
    const div = document.createElement('div')
    div.className = className
    document.getElementsByTagName('body')[0].appendChild(div)
    const style = window.getComputedStyle(div)
    const src = style.backgroundImage.slice(4, style.backgroundImage.length - 1).replace(/"/g, '')
    div.parentNode.removeChild(div)
    return src
  }

  getImageFromClassBackgroundImageSrcWhenLoaded (className: string) {
    return this.getImageFromSrcWhenLoaded(this.getBackgroundImageSrcFromClass(className))
  }

  getRandomFloatInRange (min, max) {
    return (Math.random() * (max - min) + min)
  }

  getCoordinatesInsideElementFromEvent (event: MouseEvent, element?) {
    let el = element || event.target
    const rect = el.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  delay (ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  getElementPosition (el) {
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return { y: rect.top + scrollTop, x: rect.left + scrollLeft }
  }

  hexToRgb (hex: string) {
    const result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(hex)
    if (result) {
      const rgb: { [color in 'r' | 'g' | 'b']: any } = {
        r: result[1],
        g: result[2],
        b: result[3]
      }
      for (const [color, hex] of Object.entries(rgb)) {
        if ((hex as string).length < 2) rgb[color] = `${hex}${hex}`
        rgb[color] = parseInt(rgb[color], 16)
      }
      return rgb
    } else {
      return { r: 0, g: 0, b: 0 }
    }
  }

  rgbToHex ({ r, g, b }: { r: number, g: number, b: number }) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

}
