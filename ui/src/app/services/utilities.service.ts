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
}
