import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'eqm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  get year () {
    return new Date().getFullYear()
  }

}
