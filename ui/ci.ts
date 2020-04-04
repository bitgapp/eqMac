
import CI from '../ci/project'

const { version } = require('./package.json')
const [ major, minor ] = version.split('.')

export default new CI({
  pwd: __dirname,
  name: 'ui',
  platform: {
    type: 'Node'
  },
  install: true,
  build: true,
  hosting: {
    type: 'Google Cloud Storage',
    domain: `ui-v${major}${minor}0.eqmac.app`
  }
})
