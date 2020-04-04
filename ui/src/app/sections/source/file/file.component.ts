import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core'
import {
  UtilitiesService
} from '../../../services/utilities.service'
import {
  FileService
} from './file.service'
import { ApplicationService } from '../../../services/app.service'

interface FileMeta {
  name: string
  duration: number
}

@Component({
  selector: 'eqm-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})

export class FileComponent implements OnInit, OnDestroy {
  readonly defaultMeta = {
    name: null,
    duration: 0
  }
  private syncedOnce = false
  private progressProjectionInterval = null
  private progressSetDebouncer = null
  selected = false
  meta: FileMeta = null
  playing = false
  progress = 0

  constructor (private fileService: FileService, public utils: UtilitiesService, private app: ApplicationService) {
    this.setDefaultMeta()
  }

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  ngOnDestroy () {
    if (this.progressProjectionInterval) {
      clearInterval(this.progressProjectionInterval)
    }
  }

  private setDefaultMeta () {
    this.meta = this.utils.deepCloneJSON(this.defaultMeta)
  }

  private setProgressProjection () {
    const refreshFPS = 30

    if (this.progressProjectionInterval) {
      clearInterval(this.progressProjectionInterval)
    }
    if (this.playing) {
      this.progressProjectionInterval = setInterval(() => {
        const oneSecondLength = 1 / this.meta.duration
        this.progress += oneSecondLength / refreshFPS
      }, 1000 / refreshFPS)
    }
  }

  async toggleFilePlayback () {
    try {
      this.playing = !this.playing
      this.setProgressProjection()
      this.playing = await this.fileService.togglePlayback()
      this.setProgressProjection()
    } catch (err) {
      this.playing = false
    }
  }

  async openFile () {
    try {
      const url = await this.fileService.select()
      if (url) {
        await this.fileService.open(url)
      }
      this.getFile()
    } catch (_) {}
  }

  async sync () {
    const thingsToSync = [
      this.getSelected()
    ]
    if (this.selected || !this.syncedOnce) {
      thingsToSync.push(
          this.getFile(),
          this.getProgress(),
          this.getPlaybackState()
        )
    }
    await Promise.all(thingsToSync)
    this.syncedOnce = true

  }

  async getSelected () {
    try {
      this.selected = await this.fileService.getSelected()
    } catch (err) {
      this.selected = false
    }
  }
  async getFile () {
    try {
      this.meta = await this.fileService.getMeta()
    } catch (err) {
      this.setDefaultMeta()
    }
  }

  async getProgress () {
    try {
      this.progress = await this.fileService.getProgress()
    } catch (err) {
      this.progress = 0
    }
  }

  async getPlaybackState () {
    try {
      this.playing = await this.fileService.getPlaying()
      this.setProgressProjection()
    } catch (err) {
      this.playing = false
    }
  }

  async setProgress () {
    if (this.progressSetDebouncer) {
      clearTimeout(this.progressSetDebouncer)
    }
    this.progressSetDebouncer = setTimeout(async () => {
      try {
        await this.fileService.setProgress(this.progress)
      } catch (err) {
        this.progress = 0
      }
    }, 10)
  }

  protected setupEvents () {
    this.fileService.onPlayingChanged(playing => {
      this.playing = playing
    })

    this.fileService.onProgressChanged(progress => {
      this.progress = progress
    })
  }
}
