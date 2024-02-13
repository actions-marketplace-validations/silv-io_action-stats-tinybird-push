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

  const jobs = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs',
    {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      run_id: github.context.runId
    }
  )

  core.info(`Jobs: ${JSON.stringify(jobs)}`)

  const tinybird_payload = {
    run_id: github.context.runId,
    start: startTime,
    end: endTime,
    commit: github.context.sha,
    branch: github.context.ref,
    job_name: github.context.job,
    repository: github.context.repo.repo
  }

  core.info(
    `Would send: ${JSON.stringify(tinybird_payload)} to ${tb_endpoint} with token ${tb_token}`
  )
}

export const getVarName = (): string => `STATE_${START_TIME_VAR}`
