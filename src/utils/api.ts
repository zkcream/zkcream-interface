import axios, { AxiosResponse } from 'axios'
import { DateProps, ElectionData } from '../state/election/reducer'

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

  const start = parseInt(maciParams.signUpTimestamp.hex, 16)
  const signUpEnd = parseInt(maciParams.signUpDurationSeconds.hex, 16)
  const votingEnd = parseInt(maciParams.votingDurationSeconds.hex, 16)
  const signUpDeadline = (start + signUpEnd) * 1000
  const votingDeadline = (start + signUpEnd + votingEnd) * 1000
  const now = new Date().getTime()
  const signUpUntil = signUpDeadline - now > 0 ? calcDifference(signUpDeadline - now) : null
  const votingUntil = signUpDeadline - now > 0 ? calcDifference(votingDeadline - now) : null

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
    signUpUntil,
    votingUntil,
  }
}

function calcDifference(diff: number): DateProps {
  const d = Math.floor(diff / 1000 / 60 / 60 / 24)
  diff -= d * 1000 * 60 * 60 * 24

  const h = Math.floor(diff / 1000 / 60 / 60)
  diff -= h * 1000 * 60 * 60

  const m = Math.floor(diff / 1000 / 60)
  diff -= m * 1000 * 60

  const s = Math.floor(diff / 1000)

  return { d, h, m, s }
}
