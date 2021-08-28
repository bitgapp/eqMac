import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'eqm-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: [ './prompt.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptComponent implements OnInit {
  ngOnInit () {
  }
}
