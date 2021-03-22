import { Component, OnInit, ElementRef } from '@angular/core'

@Component({
  selector: 'eqm-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  ngOnInit () {
  }

  scrollTo (id: string) {
    const elem = document.getElementById(id)
    elem.scrollIntoView({ behavior: 'smooth' })
  }



}
