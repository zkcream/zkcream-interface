import axios, { AxiosResponse } from 'axios'
import { DateTime } from 'luxon'
import { VotingState } from '../state/election/actions'
import { ElectionData } from '../state/election/reducer'

/* api settngs */
const API_HOST = process.env.REACT_APP_API_HOST
axios.defaults.baseURL = API_HOST
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

/* get request to API server */
export async function get(path?: string): Promise<AxiosResponse<any>> {
  const url: string = path ? API_HOST + '/' + path : (API_HOST as string)
  return await axios.get(url)
}

/* post request to API server */
export async function post(path: string, data: any): Promise<AxiosResponse<any>> {
  const url = API_HOST + '/' + path
  return await axios.post(url, data)
}

/* fetch holding token status */
export async function fetchTokenStatus(address: string, account: string): Promise<any> {
  return (await get('zkcream/' + address + '/' + account)).data
}

/* get contract information form event log */
export async function fetchContractDetails(log: string[]): Promise<ElectionData> {
  const decodedLog = (await get('zkcream/' + log[0])).data
  const maciParams = (await get('maci/params/' + decodedLog.maciAddress)).data
  const tokenCounts: number[] = []

  if (decodedLog.approved) {
    for (let i = 0; i < decodedLog.recipients.length; i++) {
      const r = (await get('zkcream/tally/' + log[0] + '/' + decodedLog.recipients[i])).data
      tokenCounts.push(r)
    }
  }

  const now = DateTime.now()

  const signUpTimestamp = parseInt(maciParams.signUpTimestamp.hex, 16)
  const signUpEnd = parseInt(maciParams.signUpDurationSeconds.hex, 16)
  const signUpDeadline = DateTime.fromSeconds(signUpTimestamp + signUpEnd)
  const s = signUpDeadline > now ? signUpDeadline.diff(now, ['days', 'hours', 'minutes', 'seconds']) : null
  const signUpUntil = s
    ? {
        days: s!.days,
        hours: s!.hours,
        minutes: s!.minutes,
        seconds: Math.round(s!.seconds),
      }
    : s

  const votingTimestamp = parseInt(maciParams.votingDurationSeconds.hex, 16)
  const votingDeadline = DateTime.fromSeconds(signUpTimestamp + signUpEnd + votingTimestamp)
  const v = votingDeadline > now ? votingDeadline.diff(now, ['days', 'hours', 'minutes', 'seconds']) : null
  const votingUntil = v
    ? {
        days: v!.days,
        hours: v!.hours,
        minutes: v!.minutes,
        seconds: Math.round(v!.seconds),
      }
    : v

  const totalVotes = maciParams.totalVotes
  const hasUnprocessedMessages = maciParams.hasUnprocessedMessages

  const votingState =
    s || v
      ? VotingState.ACTIVE
      : decodedLog.approved
      ? VotingState.FINISHED
      : decodedLog.tallyHash
      ? VotingState.AWAITING
      : VotingState.CALCULATING

  /* TODO implement differetn election patterns */
  return {
    title: decodedLog.title,
    recipients: decodedLog.recipients,
    electionType: decodedLog.electionType,
    owner: decodedLog.owner,
    coordinator: decodedLog.coordinator,
    zkCreamAddress: log[0],
    maciAddress: decodedLog.maciAddress,
    votingTokenAddress: decodedLog.votingTokenAddress,
    signUpTokenAddress: decodedLog.signUpTokenAddress,
    hash: log[1],
    tallyHash: decodedLog.tallyHash,
    approved: decodedLog.approved,
    maciParams,
    tokenCounts,
    signUpTimestamp,
    signUpUntil,
    votingUntil,
    totalVotes,
    hasUnprocessedMessages,
    votingState,
  }
}
