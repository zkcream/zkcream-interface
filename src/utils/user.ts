import axios from 'axios'
import querystring from 'querystring'
import detectEthereumProvider from '@metamask/detect-provider'
import { DataToSign } from '../constants/misc'
import { ethers } from 'ethers'

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
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const msgHash = ethers.utils.hashMessage(DataToSign)
    const signer = provider.getSigner()
    const sig = await signer.signMessage(msgHash)
    const address = await signer.getAddress()
    return { address, sig }
  } else {
    return null
  }
}