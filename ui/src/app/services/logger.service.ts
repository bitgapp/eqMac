import { environment } from 'src/environments/environment'

export class Logger {
  static log (...something: any[]) {
    this.console('log', ...something)
  }

  private static console (func: 'log' , ...something: any[]) {
    if (!environment.production) {
      console[func](...something)
    }
  }
}
