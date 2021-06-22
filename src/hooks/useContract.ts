import { useMemo } from 'react'
import { BytesLike } from '@ethersproject/bytes'
import { Contract, ContractFactory } from '@ethersproject/contracts'

import { useActiveWeb3React } from '../hooks/web3'
import { getContract, getContractFactory } from '../utils'

import FACTORY from '../abis/CreamFactory.json'
import ZKCREAM from '../abis/Cream.json'
import VOTING_TOKEN from '../abis/VotingToken.json'
import SIGNUP_TOKEN from '../abis/SignUpToken.json'
import ZKCREAM_VERIFIER from '../abis/CreamVerifier.json'
import MACI from '../abis/MACI.json'

const FACTORY_ADDRESS = process.env.REACT_APP_ZKCREAM_FACTORY_ADDRESS
const FACTORY_ABI = FACTORY.abi
const ZKCREAM_ABI = ZKCREAM.abi
const VOTING_TOKEN_ABI = VOTING_TOKEN.abi
const SIGNUP_TOKEN_ABI = SIGNUP_TOKEN.abi
const ZKCREAM_VERIFIER_ABI = ZKCREAM_VERIFIER.abi
const MACI_ABI = MACI.abi

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

export function useContractFactory<T extends ContractFactory = ContractFactory>(
  ABI: any,
  bytecode: BytesLike
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!ABI || !bytecode || !library || !chainId) return null

    try {
      return getContractFactory(ABI, bytecode, library, account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract factory', error)
      return null
    }
  }, [ABI, bytecode, library, chainId, account]) as T
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

export function useMaciContract(address: string) {
  return useContract<any>(address, MACI_ABI, true)
}

export function useVotingTokenContractFactory() {
  return useContractFactory<any>(VOTING_TOKEN_ABI, VOTING_TOKEN.bytecode)
}

export function useSignUpTokenContractFactory() {
  return useContractFactory<any>(SIGNUP_TOKEN_ABI, SIGNUP_TOKEN.bytecode)
}

export function useZkCreamVerifierContractFactory() {
  return useContractFactory<any>(ZKCREAM_VERIFIER_ABI, ZKCREAM_VERIFIER.bytecode)
}
