import axios, { AxiosResponse } from 'axios'

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
