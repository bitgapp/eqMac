import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'eqm-screw',
  templateUrl: './screw.component.html',
  styleUrls: [ './screw.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrewComponent implements OnInit {
  ngOnInit () {
  }
}
