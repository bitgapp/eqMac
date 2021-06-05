import * as Cloudflare from 'cloudflare'
import { config as InjectEnvs } from 'dotenv'
import { version } from '../package.json'

InjectEnvs()

const cf = Cloudflare({
  token: process.env.CLOUDFLARE_TOKEN
})

;(async () => {
  const [ major ] = version.split('.')
  const domain = `https://ui-v${major}.eqmac.app`
  await cf.zones.purgeCache(process.env.CLOUDFLARE_ZONE_ID, {
    files: [ domain ]
  })
  console.log(`🧹 Cloudflare cache successfully cleared for domain ${domain}`)
})().catch(err => {
  console.error(err)
  process.exit(1)
})
