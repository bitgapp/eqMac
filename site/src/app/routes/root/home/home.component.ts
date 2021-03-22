import { Component } from '@angular/core'
import { GithubService } from '../../../services/github.service'

@Component({
  selector: 'eqm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor (private github: GithubService) { }

  scrollTo (elem: HTMLElement) {
    return elem.scrollIntoView({ behavior: 'smooth' })
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
  
}
