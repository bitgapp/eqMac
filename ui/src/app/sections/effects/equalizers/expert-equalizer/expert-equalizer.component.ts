import { Component, OnInit, Input } from '@angular/core'
import { EqualizerComponent } from '../equalizer.component'
import { EqualizerPreset } from '../presets/equalizer-presets.component'

@Component({
  selector: 'eqm-expert-equalizer',
  templateUrl: './expert-equalizer.component.html',
  styleUrls: ['./expert-equalizer.component.scss']
})
export class ExpertEqualizerComponent extends EqualizerComponent implements OnInit {
  @Input() enabled = true
  settings = []
  constructor () { super() }

  ngOnInit () {
  }

  async sync () {
    //
  }

  savePreset (name: string) {

  }

  deletePreset () {

  }

  selectPreset (preset: EqualizerPreset) {

  }
}
