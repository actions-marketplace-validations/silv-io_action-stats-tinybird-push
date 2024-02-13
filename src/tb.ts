import * as core from '@actions/core'
import * as github from '@actions/github'

import { START_TIME_VAR } from './const'

export async function trackJob(
  startTime: number,
  endTime: number
): Promise<void> {
  const gh_token = core.getInput('github_token', { required: true })
  const tb_token = core.getInput('tinybird_token', { required: true })
  const tb_endpoint = core.getInput('tinybird_endpoint', { required: true })
  core.setSecret(tb_token)
  core.setSecret(gh_token)

  const octokit = github.getOctokit(gh_token)

  const job_name = github.context.job
  let job_id = ''
  let found = false
  const jobs = await octokit.request(
    `GET /repos/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}/jobs`
  )
  for (const job of jobs.data.jobs) {
    if (job.name === job_name) {
      job_id = job.id
      found = true
    }
  }
  if (!found) {
    core.setFailed(`Could not find job with name ${job_name}`)
  }

  core.info(`Jobs: ${JSON.stringify(jobs)}`)

  const tinybird_payload = {
    run_id: github.context.runId,
    start: startTime,
    end: endTime,
    commit: github.context.sha,
    branch: github.context.ref,
    job_name: github.context.job,
    job_id,
    repository: github.context.repo.repo
  }

  core.info(
    `Would send: ${JSON.stringify(tinybird_payload)} to ${tb_endpoint} with token ${tb_token}`
  )
}

export const getVarName = (): string => `STATE_${START_TIME_VAR}`
