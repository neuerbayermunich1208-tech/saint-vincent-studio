import config from '@payload-config'
import { getPayload } from 'payload'
import { seedStarterContent } from './content'

getPayload({ config })
  .then((payload) => seedStarterContent(payload))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
