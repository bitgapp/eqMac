import { Injectable } from '@angular/core'
import { DataService } from './data.service'

export interface TransitionSettings {
  fps: number
  duration: number
  frameCount: number
  frameDuration: number
}

@Injectable({
  providedIn: 'root'
})
export class TransitionService extends DataService {
  route = `${this.route}/transition`

  DURATION = 500
  FPS = 30
  FRAME_DURATION = 1000 / this.FPS
  FRAME_COUNT = Math.round(this.FPS * (this.DURATION / 1000))

  async getSettings (): Promise<TransitionSettings> {
    const settings: TransitionSettings = await this.request({
      method: 'GET',
      endpoint: '/'
    })

    this.DURATION = settings.duration
    this.FPS = settings.fps
    this.FRAME_DURATION = settings.frameDuration
    this.FRAME_COUNT = settings.frameCount

    return settings
  }

  perform (from: number, to: number, cb: (value: number) => any) {
    const distance = to - from
    const step = distance / this.FRAME_COUNT
    const frames = [...Array(this.FRAME_COUNT)].map((_, i) => i + 1)
    for (const frame of frames) {
      let delay = Math.round(this.FRAME_DURATION * frame)
      setTimeout(() => {
        cb(from + step * frame)
      }, delay)
    }
  }
}
