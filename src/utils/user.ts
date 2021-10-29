import axios from 'axios'
import querystring from 'querystring'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import { DataToSign, EthSigPrefix } from '../constants/misc'

axios.defaults.withCredentials = true

export async function getToken(): Promise<string|null> {
  try {
    const { address, sig } = await getSignature()
    const url = process.env.REACT_APP_API_HOST + '/user/token'
    const response = await axios.post(
      url,
      querystring.stringify({
        address: address,
        signature: sig
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
    await axios.get(url)
    return true
  } catch (e) {
    return false
  }
}

async function getSignature(): Promise<any> {
  const provider = await detectEthereumProvider({ mustBeMetaMask: true })
  if (provider && window.ethereum?.isMetaMask) {
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.requestAccounts()
    const address = accounts[0]
    const prefix = Buffer.from(EthSigPrefix);
    const buffer = Buffer.concat([prefix, Buffer.from(String(DataToSign.length)), Buffer.from(DataToSign)])
    const hash = web3.utils.sha3(buffer.toString())

    if (hash != null) {
      const sig = await web3.eth.sign(hash, accounts[0])
      if (sig != null) {
        return { address, sig }
      }
      return null
    }
  } else {
    return null
  }
}