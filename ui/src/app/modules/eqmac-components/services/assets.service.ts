import { UtilitiesService } from './utilities.service'
export type KnobSize = 'large' | 'medium' | 'small'

import { Injectable } from '@angular/core'

@Injectable()
export class AssetsService {
  constructor (private utils: UtilitiesService) {}
  readonly maxFrames = 128
  private knobLargeFrames: HTMLImageElement[] = null
  private knobSmallFrames: HTMLImageElement[] = null
  private knobMediumFrames: HTMLImageElement[] = null

  private knobLargeScale: HTMLImageElement = null
  private knobSmallScale: HTMLImageElement = null
  private knobMediumScale: HTMLImageElement = null

  private loadingPromise: any = null

  load () {
    if (!this.loadingPromise) {
      this.loadingPromise = Promise.all([
        this.loadKnobLargeFrames(),
        this.loadKnobMediumFrames(),
        this.loadKnobSmallFrames(),
        this.loadKnobLargeScale(),
        this.loadKnobMediumScale(),
        this.loadKnobSmallScale()
      ])
    }
    return this.loadingPromise
  }

  private async loadKnobLargeFrames () {
    this.knobLargeFrames = await this.sliceFilmstripIntoFrames('knob-large-src', this.maxFrames)
  }

  private async loadKnobMediumFrames () {
    this.knobMediumFrames = await this.sliceFilmstripIntoFrames('knob-medium-src', this.maxFrames)
  }

  private async loadKnobSmallFrames () {
    this.knobSmallFrames = await this.sliceFilmstripIntoFrames('knob-small-src', this.maxFrames)
  }

  private async loadKnobLargeScale () {
    this.knobLargeScale = await this.utils.getImageFromClassBackgroundImageSrcWhenLoaded('knob-scale-large-src')
  }

  private async loadKnobMediumScale () {
    this.knobMediumScale = await this.utils.getImageFromClassBackgroundImageSrcWhenLoaded('knob-scale-medium-src')
  }

  private async loadKnobSmallScale () {
    this.knobSmallScale = await this.utils.getImageFromClassBackgroundImageSrcWhenLoaded('knob-scale-small-src')
  }

  getKnobFrameImageForSizeAndFrame (size: KnobSize, frame: number) {
    switch (size) {
      case 'large': {
        return this.knobLargeFrames[frame - 1]
      }
      case 'medium': {
        return this.knobMediumFrames[frame - 1]
      }
      case 'small': {
        return this.knobSmallFrames[frame - 1]
      }
    }
  }

  getKnobScaleImageForSize (size: KnobSize) {
    switch (size) {
      case 'large': {
        return this.knobLargeScale
      }
      case 'medium': {
        return this.knobMediumScale
      }
      case 'small': {
        return this.knobSmallScale
      }
    }
  }

  private roundFloorCeilFrame (frame) {
    frame = Math.round(frame)
    if (frame < 1) {
      frame = 1
    }
    if (frame > this.maxFrames) {
      frame = this.maxFrames
    }
    return frame
  }

  private sliceFilmstripIntoFrames (className: string, nFrames: number) {
    return new Promise <HTMLImageElement[]>(resolve => {
      const filmStripSrc = this.utils.getBackgroundImageSrcFromClass(className)
      return this.utils.getImageFromSrcWhenLoaded(filmStripSrc)
        .then(filmStrip => {
          const frames: HTMLImageElement[] = []
          const canvas = document.createElement('canvas')
          const imageHeight = filmStrip.height
          const imageWidth = filmStrip.width
          const frameHeight = imageHeight / nFrames
          canvas.width = imageWidth
          canvas.height = frameHeight
          const ctx = canvas.getContext('2d')

          const frameSources: string[] = []
          for (let frame = 0; frame < nFrames; frame++) {
            ctx.clearRect(0, 0, frameHeight, frameHeight)
            ctx.drawImage(filmStrip, 0, frame * frameHeight, imageWidth, frameHeight, 0, 0, frameHeight, frameHeight)
            const frameSrc = canvas.toDataURL()
            frameSources.push(frameSrc)
          }
          return Promise.all(frameSources.map(frameSrc => {
            return this.utils.getImageFromSrcWhenLoaded(frameSrc)
              .then(frame => {
                frames.push(frame)
                return Promise.resolve()
              })
          })).then(() => {
            resolve(frames)
          })
        })
    })
  }
}
