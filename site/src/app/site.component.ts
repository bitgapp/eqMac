import { Component } from '@angular/core'

@Component({
  selector: 'eqm-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent {

  scrollTo (sectionId: string) {
    const elem = document.getElementById(sectionId)
    elem.scrollIntoView({ behavior: 'smooth' })
  }
}
