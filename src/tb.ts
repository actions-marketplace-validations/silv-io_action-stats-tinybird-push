import { START_TIME_VAR } from './const'

export function trackJob(startTime: number, endTime: number): void {
  console.log(`Job started at ${startTime} and ended at ${endTime}`)
}

export const getVarName = (): string => `STATE_${START_TIME_VAR}`
