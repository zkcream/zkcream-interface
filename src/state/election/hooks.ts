import { useCallback, useEffect, useMemo } from 'react'
import { ContractFactory } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { PagingAction, setElectionData, setElections, setLogs, setTotalElections, updateCurrentPage } from './actions'
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
import { useDeployedLogs } from '../../hooks/useDeployedLogs'
import { useFetchElectionData } from '../../hooks/useFetchElectionData'

export function useDataFromEventLogs() {
  const { library } = useActiveWeb3React()
  const logs = useLogs()
  const getLogs = useDeployedLogs()
  const fetchElectionData = useFetchElectionData()
  const elections = useElections()

  useEffect(() => {
    /* early return for no library */
    if (!library) return
  }, [library])

  useEffect(() => {
    if (logs.length === 0) {
      getLogs()
    }
  }, [getLogs, logs])

  useEffect(() => {
    if (logs.length > 0) {
      fetchElectionData(logs)
    }
  }, [fetchElectionData, logs])

  return elections
}

// get event logs for all deployed zkcream contract
export function useAllElectionData(): ElectionData[] | [] {
  const formattedEvents = useDataFromEventLogs()
  return formattedEvents ? formattedEvents : []
}

export function useLimitedElectionData(limit: number = 5) {
  const current = useCurrentPage()
  const allElectionData = useAllElectionData()
  return allElectionData.slice(current * limit, current * limit + 5)
}

// set election data of passed zkcream contract address
export function useSetElectionData(address: string): () => void {
  const elections = useElections()
  const dispatch = useAppDispatch()
  const electionData = useMemo(() => {
    return elections?.find((e) => e.zkCreamAddress === address)
  }, [address, elections])

  return () => dispatch(setElectionData(electionData))
}

export function useUpdateElectionState(): (newState: ElectionData) => void {
  const dispatch = useAppDispatch()
  return useCallback((newState) => dispatch(setElectionData(newState)), [dispatch])
}

export function useElectionState(): ElectionData | undefined {
  return useAppSelector((state: RootState) => state.election.electionData)
}

export function useElections(): ElectionData[] {
  return useAppSelector((state: RootState) => state.election.elections)
}

export function useLogs() {
  return useAppSelector((state: RootState) => state.election.logs)
}

export function useSetLogs() {
  const dispatch = useAppDispatch()
  return useCallback((logs) => dispatch(setLogs(logs)), [dispatch])
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

export function useSetTotalElections() {
  const dispatch = useAppDispatch()
  return useCallback((count: number) => dispatch(setTotalElections(count)), [dispatch])
}

/*
 * update elections
 */
export function useSetElections(): (elections: ElectionData[]) => void {
  const dispatch = useAppDispatch()
  return useCallback((elections) => dispatch(setElections(elections)), [dispatch])
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
