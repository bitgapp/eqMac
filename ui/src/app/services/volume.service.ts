import { Injectable } from '@angular/core'
import { DataService } from './data.service'

@Injectable({
  providedIn: 'root'
})
export class VolumeService extends DataService {
  route = `${this.route}/volume`
}
