import { Component, OnInit, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'eqm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sectionClicked = new EventEmitter<string>()
  constructor () { }

  ngOnInit () {
  }

}
