import { useCallback, useEffect, useMemo, useState } from 'react'
import { ContractFactory } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { PagingAction, setElectionData, setTotalElections, updateCurrentPage } from './actions'
import { ElectionData } from './reducer'
import { useAppDispatch, useAppSelector } from '../hooks'
import { RootState } from '../index'

import {
  useFactoryContract,
  useSignUpTokenContractFactory,
  useVotingTokenContractFactory,
  useZkCreamVerifierContractFactory,
} from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { get } from '../../utils/api'

export function useDataFromEventLogs() {
  const { library } = useActiveWeb3React()
  const [electionDataState, setElectionDataState] = useState<ElectionData[]>()

  useEffect(() => {
    /* early return for no library */
    if (!library) return

    if (!electionDataState) {
      fetchFromFactory()
    }

    async function fetchFromFactory() {
      setElectionDataState(undefined)
      const logs = (await get('factory/logs')).data
      const elections: ElectionData[] = await Promise.all(
        logs.map(async (log: any) => {
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
            maciParams,
          }
        })
      )
      setElectionDataState(elections.reverse())
    }
  }, [electionDataState, library])

  return electionDataState
}

// get event logs for all deployed zkcream contract
export function useAllElectionData(): ElectionData[] | [] {
  const formattedEvents = useDataFromEventLogs()
  return formattedEvents ? formattedEvents : []
}

export function useLimitedElectionData(limit: number = 5) {
  const current = useCurrentPage()
  const allElectionData = useAllElectionData()
  useSetTotalElections(allElectionData.length)
  return allElectionData.slice(current * limit, current * limit + 5)
}

// set election data of passed zkcream contract address
export function useSetElectionData(address: string): () => void {
  const allElectionData = useAllElectionData()
  const dispatch = useAppDispatch()
  const electionData = useMemo(() => {
    return allElectionData?.find((e) => e.zkCreamAddress === address)
  }, [address, allElectionData])

  return () => dispatch(setElectionData(electionData))
}

export function useElectionState(): ElectionData | undefined {
  return useAppSelector((state: RootState) => state.election.electionData)
}

// deploy all modules for `useDeployCallback()` function
async function deployModules(
  votingTokenContract: ContractFactory,
  signUpTokenContract: ContractFactory,
  zkCreamVerifierContract: ContractFactory
) {
  /* consider better UX */
  const votingTokenAddress = (await votingTokenContract.deploy()).address
  const signUpTokenAddress = (await signUpTokenContract.deploy()).address
  const zkCreamVerifierAddress = (await zkCreamVerifierContract.deploy()).address

  return {
    votingTokenAddress,
    signUpTokenAddress,
    zkCreamVerifierAddress,
  }
}

// deploy new zkcream contract
export function useDeployCallback(): {
  deployCallback: (data: any) => Promise<string> | undefined
} {
  const { account } = useActiveWeb3React()

  const factoryContract = useFactoryContract()
  const votingTokenContract = useVotingTokenContractFactory()
  const signUpTokenContract = useSignUpTokenContractFactory()
  const zkCreamVerifierContract = useZkCreamVerifierContractFactory()

  const deployCallback = useCallback(
    async (data: any) => {
      if (!account) return

      const { votingTokenAddress, signUpTokenAddress, zkCreamVerifierAddress } = await deployModules(
        votingTokenContract,
        signUpTokenContract,
        zkCreamVerifierContract
      )

      const args = [
        zkCreamVerifierAddress,
        votingTokenAddress,
        signUpTokenAddress,
        data.initial_voice_credit_balance,
        data.merkle_tree_height,
        data.recipients,
        data.ipfsHash,
        data.coordinator_pubkey,
        data.coordinator_address,
      ]

      return factoryContract.estimateGas.createCream(...args, {}).then(() => {
        return factoryContract.createCream(...args, { value: null }).then((response: TransactionResponse) => {
          return response.hash
        })
      })
    },
    [account, factoryContract, signUpTokenContract, votingTokenContract, zkCreamVerifierContract]
  )
  return { deployCallback }
}

/*
 * total elections
 */
export function useTotalElections(): number {
  return useAppSelector((state: RootState) => state.election.total)
}

export function useSetTotalElections(count: number) {
  const dispatch = useAppDispatch()
  dispatch(setTotalElections(count))
}

/*
 * paging for election lists
 */
export function useCurrentPage(): number {
  return useAppSelector((state: RootState) => state.election.currentPage)
}

export function useUpdateCurrentPage(action: PagingAction): () => void {
  const current = useCurrentPage()
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(updateCurrentPage(action ? current + 1 : current - 1)), [dispatch, action, current])
}

export function useLoadPrevPage(): () => void {
  return useUpdateCurrentPage(PagingAction.PREV)
}

export function useLoadNextPage(): () => void {
  return useUpdateCurrentPage(PagingAction.NEXT)
}
