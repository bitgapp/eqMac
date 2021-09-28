import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  delay (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  mapValue (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }

  clampValue ({ value, min, max }: { value: number, min: number, max: number }) {
    if (value < min) {
      value = min
    } else if (value > max) {
      value = max
    }
    return value
  }

  getTimestampFromDurationAndProgress (duration, progress = 1) {
    const currentSecond = Math.floor(duration * progress)
    let minutes = Math.floor(currentSecond / 60).toString()
    let seconds = Math.floor(currentSecond % 60).toString()
    if (minutes.length < 2) {
      minutes = '0' + minutes
    }

    if (seconds.length < 2) {
      seconds = '0' + seconds
    }

    return `${minutes}:${seconds}`
  }

  deepCloneJSON (json) {
    return JSON.parse(JSON.stringify(json))
  }

  async waitForProperty (obj: any, prop: string, opts?: { retry: number, delay: number }) {
    opts = opts || {
      retry: 10,
      delay: 1000
    }
    opts.retry = opts.retry || 10
    opts.delay = opts.delay || 1000
    for (let i = 0; i < opts.retry; i++) {
      await this.delay(opts.delay)
      if (prop in obj) return
    }
    throw new Error(`Property "${prop}" never appeared`)
  }

  static mergeClasses (baseClass: any, extendedClasses: any[]) {
    extendedClasses.forEach(extendedClass => {
      Object.getOwnPropertyNames(extendedClass.prototype).forEach(name => {
        if (name !== 'constructor') {
          baseClass.prototype[name] = extendedClass.prototype[name]
        }
      })
    })
  }

  getCoordinatesInsideElementFromEvent (event: MouseEvent, element?: HTMLElement) {
    const el = element || event.target as HTMLElement
    const rect = el.getBoundingClientRect()
    const scale = rect.width / el.clientWidth
    return {
      x: (event.clientX - rect.left) / scale,
      y: (event.clientY - rect.top) / scale
    }
  }

  static async injectScript ({ src, id }: { src: string, id?: string }) {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.onload = () => {
        resolve()
      }
      script.onerror = (err) => {
        reject(err)
      }
      script.src = src
      if (id) {
        script.id = id
      }
      const head = document.getElementsByTagName('head')[0]
      head.appendChild(script)
    })
  }

  quickHash (str: string) { return UtilitiesService.quickHash(str) }
  static quickHash (str: string) {
    let hash = 0
    let chr: number
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }
}
