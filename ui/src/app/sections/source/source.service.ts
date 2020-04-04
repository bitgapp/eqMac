import { Injectable } from '@angular/core'
import { DataService } from '../../services/data.service'

export type SourceType = 'File' | 'Input' | 'System'

@Injectable({
  providedIn: 'root'
})
export class SourceService extends DataService {
  route = `${this.route}/source`

  async getSource (): Promise<SourceType> {
    const resp = await this.request({ method: 'GET', endpoint: '' })
    return resp.source
  }

  setSource (source: SourceType) {
    return this.request({ method: 'POST', endpoint: '', data: { source } })
  }

  onSourceChanged (callback: (source: SourceType) => void) {
    this.on(({ source }) => callback(source))
  }
}
