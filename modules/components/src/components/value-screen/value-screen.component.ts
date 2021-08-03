import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core'

@Component({
  selector: 'eqm-value-screen',
  templateUrl: './value-screen.component.html',
  styleUrls: [ './value-screen.component.scss' ]
})
export class ValueScreenComponent implements OnInit {
  @Input() fontSize = 10
  @Input() enabled = true

  ngOnInit () {}
}
