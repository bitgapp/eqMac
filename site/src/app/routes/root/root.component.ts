import { Component, OnInit, ElementRef } from '@angular/core'
import { GithubService } from 'src/app/services/github.service'

@Component({
  selector: 'eqm-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  constructor (private github: GithubService) { }

  ngOnInit () {
  }

  async download (urlPresent) {
    if (urlPresent) return
    const url = await this.github.getLatestDownloadUrl()
    const link = document.createElement('a')
    link.download = 'eqmac.dmg'
    link.href = url
    link.click()
  }

  takeATour () {
    // TODO: Implement
  }
  scrollTo (elem: HTMLElement) {
    elem.scrollIntoView({ behavior: 'smooth' })
  }

}
