import { Component, OnInit, ViewEncapsulation } from '@angular/core'

@Component({
  selector: `eqm-faq`,
  templateUrl: `./faq.component.html`,
  styleUrls: [`./faq.component.scss`],
  encapsulation: ViewEncapsulation.None
})
export class FAQComponent implements OnInit {
  // tslint:disable:max-line-length
  QA: { Q: string, A: string }[] = [{
    Q: `What is the point eqMac? What is an Audio Equalizer?`,
    A: `If if you feel like your audio hardware (headphones, speaker) does not have enough Bass (low frequency) punch, or vice versa, you can adjust that using eqMac.
    <br>
    Watch <a target="_blank" href="https://youtu.be/I6ZF_NHvqzU?t=41">THIS VIDEO</a> for a better explanation.`
  }, {
    Q: `How do you install eqMac?`,
    A: `Press the Download button on the home page.
    <br>
    Open the downloaded eqMac.dmg file (if you accidentally closed the window you can always reopen it by Finding it as a Drive in your Finder).
    <br>
    Drag the eqMac app into Applications directory.
    <br>
    Open eqMac.app from you Applications directory.`
  }, {
    Q: `Why is eqMac asking for Admin Password during the first launch?`,
    A: `The way eqMac works it needs to install an Audio Driver, to do that it needs your system password.<br>The app never sees your password as it uses secure Apple API to perform the install.`
  }, {
    Q: `Why is eqMac asking for permission to access my microphone?`,
    A: `macOS does not have direct way to access the System Audio stream, so we use the eqMac Audio driver to divert the system audio to the drivers input stream.<br>Then eqMac captures that input audio stream, processses it and sends it directly to the output device.`
  }, {
    Q: `Sometimes there are sound issues using eqMac?`,
    A: `Sometimes there are synching issues, try to switch away from eqMac audio device to your preferred output device and eqMac should restart the audio pipeline.<br>Alternatively, you can try to restart eqMac, that should help as well`
  }, {
    Q: `How do I uninstall eqMac?`,
    A: `The proper way to uninstall eqMac is to click the "Uninstall" button in eqMac Settings section.
    <br>That will run a script to uninstall the app and the driver properly.
    <br>If for whatever reason you cannot run eqMac, to uninstall the driver you can run this command in Terminal: 
    <br><br>
    <div class="terminal-command">sudo rm -rf /Library/Audio/Plug-Ins/HAL/eqMac.driver/ && sudo launchctl kickstart -k system/com.apple.audio.coreaudiod &>/dev/null</div>`
  }]
  // tslint:enable:max-line-length

  constructor () { }

  ngOnInit () {
  }

}
