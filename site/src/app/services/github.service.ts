import { Injectable } from '@angular/core'
import { ConstantsService } from './constants.service'
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  readonly GITHUB_API_BASE_URL = 'https://api.github.com'
  constructor (private CONST: ConstantsService, private http: HttpClient) { }

  async getLatestDownloadUrl () {
    const release = await this.getLatestRelease()
    const { assets } = release
    const binary = assets.find(a => a.name.includes('.pkg'))
    const downloadUrl = binary.browser_download_url
    return downloadUrl
  }

  getReleases () {
    return this.request('GET', '/releases')
  }

  getLatestRelease () {
    return this.request('GET', '/releases/latest')
  }

  private async request (method: 'GET' | 'POST', endpoint: string, data?: any) {
    if (endpoint[0] !== '/') { endpoint = `/${endpoint}` }
    const GITHUB_REPO = `/repos/${this.CONST.GH_GROUP}/${this.CONST.GH_NAME}`
    const url = `${this.GITHUB_API_BASE_URL}${GITHUB_REPO}${endpoint}`
    const request = new HttpRequest(method, url, data, { responseType: 'json' })
    const resp = await this.http.request(request).toPromise() as HttpResponse<any>
    return resp.body
  }
}
