import { Component, OnDestroy, OnInit } from '@angular/core'
import { SourceChangedEventCallback, SourceService, SourceType } from './source.service'

@Component({
  selector: 'eqm-source',
  templateUrl: './source.component.html',
  styleUrls: [ './source.component.scss' ]
})
export class SourceComponent implements OnInit, OnDestroy {
  source: SourceType = 'File'
  constructor (public sourceService: SourceService) { }

  ngOnInit () {
    this.setupEvents()
  }

  private onSourceChangedEventCallback: SourceChangedEventCallback
  protected setupEvents () {
    this.onSourceChangedEventCallback = ({ source }) => {
      this.source = source
    }
    this.sourceService.onSourceChanged(this.onSourceChangedEventCallback)
  }

  private destroyEvents () {
    this.sourceService.offSourceChanged(this.onSourceChangedEventCallback)
  }

  async setSource (source: SourceType) {
    if (this.source !== source) {
      this.source = source
      this.sourceService.setSource(this.source)
    }
  }

  ngOnDestroy () {
    this.destroyEvents()
  }
}
