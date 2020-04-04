import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  readonly DOMAIN = 'eqmac.app'
  readonly LOCAL_API_URL = `https://127.0.0.1`
  readonly REMOTE_API_URL = `https://api.${this.DOMAIN}`
}
