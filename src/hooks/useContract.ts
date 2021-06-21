import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'

import { useActiveWeb3React } from '../hooks/web3'
import { getContract } from '../utils'

import FACTORY from '../abis/CreamFactory.json'
import ZKCREAM from '../abis/Cream.json'
import VOTING_TOKEN from '../abis/VotingToken.json'

const FACTORY_ADDRESS = process.env.REACT_APP_ZKCREAM_FACTORY_ADDRESS
const FACTORY_ABI = FACTORY.abi
const ZKCREAM_ABI = ZKCREAM.abi
const VOTING_TOKEN_ABI = VOTING_TOKEN.abi

// use contract passed by arg
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null

    // check contract address exists
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null

    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [ABI, account, addressOrAddressMap, chainId, library, withSignerIfPossible]) as T
}

export function useFactoryContract() {
  /* TODO: Typechain impl */
  return useContract<any>(FACTORY_ADDRESS, FACTORY_ABI, true)
}

export function useZkCreamContract(address: string) {
  return useContract<any>(address, ZKCREAM_ABI, true)
}

export function useVotingTokenContract(address: string) {
  return useContract<any>(address, VOTING_TOKEN_ABI, true)
}
