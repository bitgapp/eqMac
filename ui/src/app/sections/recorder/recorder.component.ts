import { Component, OnInit } from '@angular/core'
import { UtilitiesService } from '../../services/utilities.service'

@Component({
  selector: 'eqm-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnInit {
  recording = false
  recorderCounterInterval = null
  duration = 0
  constructor (public utils: UtilitiesService) { }

  ngOnInit () {
  }

  toggleRecording () {
    if (this.recording) {
      this.recording = false
      if (this.recorderCounterInterval) {
        clearInterval(this.recorderCounterInterval)
      }
    } else {
      this.duration = 0
      this.recording = true
      this.recorderCounterInterval = setInterval(() => {
        this.duration++
      }, 1000)
    }
  }

}
