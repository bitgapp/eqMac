import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'eqm-question',
  template: '<eqm-icon [stroke]="0" color="#c9cdd0" [width]="8" [height]="8" name="help"></eqm-icon>',
  styles: [ ':host { height: 12px; width: 12px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background-color: #2c2c2e; }' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent implements OnInit {
  ngOnInit () {
  }
}
