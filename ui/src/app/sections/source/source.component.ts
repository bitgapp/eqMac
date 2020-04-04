import { Component, OnInit } from '@angular/core'
import { SourceService, SourceType } from './source.service'

@Component({
  selector: 'eqm-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  source: SourceType = 'File'
  constructor (private sourceService: SourceService) { }

  ngOnInit () {
    this.setupEvents()
  }

  protected setupEvents () {
    this.sourceService.onSourceChanged(source => {
      this.source = source
    })
  }

  async setSource (source: SourceType) {
    if (this.source !== source) {
      this.source = source
      this.sourceService.setSource(this.source)
    }
  }

}
