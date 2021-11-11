import { Component, OnInit, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core'
import { ColorsService } from '../../services/colors.service'

@Component({
  selector: 'eqm-container',
  templateUrl: './container.component.html',
  styleUrls: [ './container.component.scss' ]
})
export class ContainerComponent implements OnInit {
  @HostBinding('class.enabled') @Input() enabled = true
  @Input() @HostBinding('style.background-color') color = ColorsService.dark
  ngOnInit () {
  }
}
