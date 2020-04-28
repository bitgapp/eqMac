import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  readonly DOMAIN = 'eqmac.app'
  readonly FAQ_URL = new URL(`https://${this.DOMAIN}/faq`)
  readonly BUG_REPORT_URL = new URL(`https://${this.DOMAIN}/report-bug`)
  readonly LOCAL_API_URL = `https://127.0.0.1`
  readonly REMOTE_API_URL = `https://api.${this.DOMAIN}`
}
