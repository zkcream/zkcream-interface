import axios from 'axios'
import querystring from 'querystring'

export async function getToken(): Promise<string | null> {
  try {
    const url = process.env.REACT_APP_API_HOST + '/user/login'
    const response = await axios.post(
      url,
      querystring.stringify({
        username: process.env.REACT_APP_API_USERNAME,
        password: process.env.REACT_APP_API_PASSWORD
      })
    )
    return response.data.token
  } catch (e) {
    return null
  }
}

export async function verify(): Promise<boolean> {
  try {
    const url = process.env.REACT_APP_API_HOST + '/user/verify'
    const Authorization = `Bearer ${localStorage.getItem('token')}`
    await axios.get(
      url,
      { headers: { Authorization } }
    )
    return true
  } catch (e) {
    return false
  }
}