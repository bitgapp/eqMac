import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  mapValue (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }

  logMapValue ({ value, inMin, inMax, outMin, outMax }: {
    value: number
    inMin: number
    inMax: number
    outMin: number
    outMax: number
  }) {
    outMin = Math.log(outMin)
    outMax = Math.log(outMax)
    const scale = (outMax - outMin) / (inMax - inMin)
    return Math.exp(outMin + scale * (value - inMin))
  }

  logMapValueInverse ({ value, inMin, inMax, outMin, outMax }: {
    value: number
    inMin: number
    inMax: number
    outMin: number
    outMax: number
  }) {
    inMin = Math.log(inMin || 1)
    inMax = Math.log(inMax)
    outMin = outMin || 1
    const scale = (inMax - inMin) / (outMax - outMin)
    const result = (Math.log(value) - inMin) / scale + outMin
    return result
  }

  getImageFromSrcWhenLoaded (src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous' // This enables CORS
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
    div.parentNode?.removeChild(div)
    return src
  }

  getImageFromClassBackgroundImageSrcWhenLoaded (className: string) {
    return this.getImageFromSrcWhenLoaded(this.getBackgroundImageSrcFromClass(className))
  }

  getRandomFloatInRange (min: number, max: number) {
    return (Math.random() * (max - min) + min)
  }

  getCoordinatesInsideElementFromEvent (event: MouseEvent, element?: HTMLElement) {
    const el = element || event.target as HTMLElement
    const rect = el.getBoundingClientRect()
    const scale = rect.width / el.offsetWidth
    return {
      x: (event.clientX - rect.left) / scale,
      y: (event.clientY - rect.top) / scale
    }
  }

  delay (ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  getElementPosition (el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scale = rect.width / el.offsetWidth
    return {
      y: (rect.top + scrollTop) / scale,
      x: (rect.left + scrollLeft) / scale
    }
  }

  hexToRgb (hex: string) {
    const result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(hex)
    if (result) {
      type colorCode = 'r' | 'g' | 'b'
      const rgb: { [color in colorCode]: any } = {
        r: result[1],
        g: result[2],
        b: result[3]
      }
      for (const [ color, hex ] of Object.entries(rgb)) {
        if ((hex as string).length < 2) rgb[color as colorCode] = `${hex}${hex}`
        rgb[color as colorCode] = parseInt(rgb[color as colorCode], 16)
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
