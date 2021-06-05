import { Injectable } from '@angular/core'
import { VolumeService } from '../../../../services/volume.service'

@Injectable({
  providedIn: 'root'
})
export class BalanceService extends VolumeService {
  async getBalance () {
    const resp = await this.request({ method: 'GET', endpoint: '/balance' })
    return resp.balance
  }

  setBalance (balance, transition?: boolean) {
    return this.request({ method: 'POST', endpoint: '/balance', data: { balance, transition } })
  }

  onBalanceChanged (callback: BalanceChangedEventCallback) {
    this.on(callback)
  }

  offBalanceChanged (callback: BalanceChangedEventCallback) {
    this.off(callback)
  }
}

export type BalanceChangedEventCallback = (data: { balance: number }) => void
