import { getVarName, trackJob } from './tb'

const start = Number(process.env[getVarName()])
const end = new Date().valueOf()
trackJob(start, end)
