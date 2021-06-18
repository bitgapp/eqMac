import { Component, OnInit } from '@angular/core'
import { Options } from 'src/app/components/options/options.component'
import { ApplicationService, Info } from 'src/app/services/app.service'
import { ConstantsService } from 'src/app/services/constants.service'
import packageJson from '../../../../package.json'
import { UIService } from '../../services/ui.service'

@Component({
  selector: 'eqm-help',
  templateUrl: './help.component.html',
  styleUrls: [ './help.component.scss' ]
})
export class HelpComponent implements OnInit {
  options: Options = [
    [
      {
        type: 'button',
        label: 'FAQ',
        action: this.faq.bind(this)
      }, {
        type: 'button',
        label: 'Report a Bug',
        action: this.reportBug.bind(this)
      }
    ]
  ]

  constructor (
    public app: ApplicationService,
    public CONST: ConstantsService,
    public ui: UIService
  ) {}

  uiVersion = `${packageJson.version} (${this.ui.isLocal ? 'Local' : 'Remote'})`
  info: Info
  ngOnInit () {
    this.fetchInfo()
  }

  async fetchInfo () {
    this.info = await this.app.getInfo()
  }

  reportBug () {
    this.app.openURL(this.CONST.BUG_REPORT_URL)
  }

  faq () {
    this.app.openURL(this.CONST.FAQ_URL)
  }
}
