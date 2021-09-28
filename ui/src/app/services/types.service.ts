
export class Types {
  static unreachable (type: never) {
    console.error(`Should not have reached type: ${type}`)
  }
}
