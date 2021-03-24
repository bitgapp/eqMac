import { Injectable } from '@angular/core'
import { SourceService } from '../source.service'

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class FileService extends SourceService {
  route = `${this.route}/file`

  async select () {
    const resp = await this.request({ method: 'GET', endpoint: '/select' })
    return resp.url
  }

  open (url) {
    return this.request({ method: 'POST', endpoint: '/open', data: { url } })
  }

  getMeta () {
    return this.request({ method: 'GET', endpoint: '/meta' })
  }

  async getSelected () {
    const resp = await this.request({ method: 'GET', endpoint: '/selected' })
    return resp.selected
  }

  async togglePlayback () {
    const resp = await this.request({ method: 'POST', endpoint: '/toggle-playback' })
    return resp.playing
  }

  async getProgress () {
    const resp = await this.request({ method: 'GET', endpoint: '/progress' })
    return resp.progress
  }

  setProgress (progress) {
    return this.request({ method: 'POST', endpoint: '/progress', data: { progress } })
  }

  async getPlaying () {
    const resp = await this.request({ method: 'GET', endpoint: '/playing' })
    return resp.playing
  }

  onPlayingChanged (callback: (playing: boolean) => void) {
    this.on('/playing', ({ playing }) => callback(playing))
  }

  onProgressChanged (callback: (progress: number) => void) {
    this.on('/progress', ({ progress }) => callback(progress))
  }
}
