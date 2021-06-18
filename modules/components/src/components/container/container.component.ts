import { Component, OnInit, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'eqm-container',
  templateUrl: './container.component.html',
  styleUrls: [ './container.component.scss' ]
})
export class ContainerComponent implements OnInit {
  @HostBinding('class.enabled') @Input() enabled = true

  ngOnInit () {
  }
}
