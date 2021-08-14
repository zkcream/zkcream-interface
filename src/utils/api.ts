import axios, { AxiosResponse } from 'axios'
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
  }
}
