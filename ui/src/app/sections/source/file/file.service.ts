import { Injectable } from '@angular/core'
import { SourceService } from '../source.service'

@Injectable({
  providedIn: 'root'
})
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

  onPlayingChanged (callback: FilePlayingChangedEventCallback) {
    this.on('/playing', callback)
  }

  offPlayingChanged (callback: FilePlayingChangedEventCallback) {
    this.off('/playing', callback)
  }

  onProgressChanged (callback: FileProgressChangedEventCallback) {
    this.on('/progress', callback)
  }

  offProgressChanged (callback: FileProgressChangedEventCallback) {
    this.off('/progress', callback)
  }
}

export type FilePlayingChangedEventCallback = (data: { playing: boolean }) => void
export type FileProgressChangedEventCallback = (data: { progress: number }) => void
