import * as fs from 'fs'
import * as os from 'os'

import { START_TIME_VAR } from './const'

fs.appendFileSync(
  process.env.GITHUB_STATE,
  `${START_TIME_VAR}=${new Date().valueOf()}${os.EOL}`,
  {
    encoding: 'utf8'
  }
)
