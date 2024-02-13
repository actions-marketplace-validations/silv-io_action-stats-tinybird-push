import * as core from '@actions/core'
import * as github from '@actions/github'

import { START_TIME_VAR } from './const'

export async function trackJob(
  startTime: number,
  endTime: number
): Promise<void> {
  const tb_token = core.getInput('tinybird_token', { required: true })
  const tb_endpoint = core.getInput('tinybird_endpoint', { required: true })
  core.setSecret(tb_token)

  const tinybird_payload = {
    run_id: github.context.runId,
    start: startTime,
    end: endTime,
    commit: github.context.sha,
    branch: github.context.ref,
    job_name: github.context.job,
    repository: github.context.repo.repo
  }

  const headers = new Headers()
  headers.append('Authorization', `Bearer ${tb_token}`)

  core.info(
    `Sending: ${JSON.stringify(tinybird_payload)} to ${tb_endpoint} with token ${tb_token}`
  )
  const response = await fetch(tb_endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(tinybird_payload)
  })
  if (!response.ok) {
    throw new Error(
      `Tinybird API returned ${response.status}: ${response.statusText}`
    )
  }
  const data = await response.json()
  core.info(data)
}

export const getVarName = (): string => `STATE_${START_TIME_VAR}`
