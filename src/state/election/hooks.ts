import { useCallback, useEffect, useState } from 'react'
import { TransactionResponse } from '@ethersproject/providers'

import { useFactoryContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { get, post } from '../../utils/api'

export interface ElectionData {
  title: string
  recipients: string[]
  electionType: string
  owner: string
  coordinator: string
  zkCreamAddress: string
  maciAddress: string
  hash: string
}

export function useDataFromEventLogs() {
  const [electionData, setElectionData] = useState<any>()

  useEffect(() => {
    async function fetchFromFactory() {
      /* TODO: need to reverse */
      const logs = (await get('factory/logs')).data
      const elections: ElectionData[] = await Promise.all(
        logs.map(async (log: any) => {
          const decodedLog = (await get('zkcream/' + log[0])).data
          /* TODO implement differetn election patterns */
          return {
            title: decodedLog.title,
            recipients: decodedLog.recipients,
            electionType: decodedLog.electionType,
            owner: decodedLog.owner,
            coordinator: decodedLog.coordinator,
            zkCreamAddress: log[0],
            maciAddress: decodedLog.maciAddress,
            hash: log[1],
          }
        })
      )
      setElectionData(elections.reverse())
    }

    if (!electionData) {
      fetchFromFactory()
    }
  })

  return electionData
}

// get event logs for all deployed zkcream contract
export function useAllElectionData(): ElectionData[] | [] {
  const formattedEvents = useDataFromEventLogs()
  return formattedEvents ? formattedEvents : []
}

// get election data of passed zkcream contract address
export function useElectionData(address: string): ElectionData | undefined {
  const allElectionData = useAllElectionData()
  return allElectionData?.find((e) => e.zkCreamAddress === address)
}

// deploy new zkcream contract
export function useDeployCallback(): {
  deployCallback: (data: any) => Promise<string> | undefined
} {
  const { account } = useActiveWeb3React()
  const factoryContract = useFactoryContract()
  const deployCallback = useCallback(
    async (data: any) => {
      if (!account) return

      return (await post('factory/deploy', data)).data

      /* TODO: do not use API and use follows */
      // const args = [
      //   data.initial_voice_credit_balance,
      //   data.merkle_tree_height,
      //   data.recipients,
      //   data.ipfsHash,
      //   data.coordinator_pubkey,
      //   data.coordinator_address
      // ]
      // return factoryContract.estimateGas.createCream(...args, {}).then(() => {
      //   return factoryContract
      //     .createCream(...args, { value: null })
      //     .then((response: TransactionResponse) => { return response.hash })
      // })
    },
    [account]
  )
  return { deployCallback }
}
