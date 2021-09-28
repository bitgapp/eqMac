import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  readonly DOMAIN = 'eqmac.app'
  readonly FAQ_URL = new URL(`https://${this.DOMAIN}#faq`)
  readonly FEATURES_URL = new URL(`https://${this.DOMAIN}#features`)
  readonly ACCOUNT_URL = new URL(`https://${this.DOMAIN}/account`)
  readonly BUG_REPORT_URL = new URL(`https://${this.DOMAIN}/report-bug`)
}
