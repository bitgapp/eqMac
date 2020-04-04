import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { GithubService } from 'src/app/services/github.service'

@Component({
  selector: 'eqm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Output() downloadPressed = new EventEmitter()
  @Output() takeATourPressed = new EventEmitter()
  url: string
  constructor (private github: GithubService) {}

  ngOnInit () {
    this.setDownloadUrl()
  }


  async setDownloadUrl () {
    this.url = await this.github.getLatestDownloadUrl()
  }

}
