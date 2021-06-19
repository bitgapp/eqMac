
export class SemanticVersion {
  constructor (private readonly version: string) {

  }

  static split (version: string) {
    const [ major, minor, patch ] = version.split('.').map(part => parseInt(part))
    return { major, minor, patch }
  }

  isGreaterThan (version: string) {
    const versionParts = SemanticVersion.split(this.version)
    const compareParts = SemanticVersion.split(version)

    if (versionParts.major > compareParts.major) return true
    if (versionParts.major < compareParts.major) return false

    if (versionParts.minor > compareParts.minor) return true
    if (versionParts.minor < compareParts.minor) return false

    if (versionParts.patch > compareParts.patch) return true
    if (versionParts.patch < compareParts.patch) return false

    return false
  }

  isGreaterThanOrEqualTo (version: string) {
    if (this.version === version) return true
    return this.isGreaterThan(version)
  }

  isLessThan (version) {
    return !this.isGreaterThanOrEqualTo(version)
  }

  isLessThanOrEqualTo (version: string) {
    if (this.version === version) return true
    return this.isLessThan(version)
  }
}
