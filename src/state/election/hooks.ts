import { useEffect, useState } from 'react'

import { get } from '../../utils/api'

export interface ElectionData {
  title: string
  recipients: string[]
  for: string | null
  against: string | null
  owner: string
  coordinator: string
  zkCreamAddress: string
  maciAddress: string
  hash: string
}

export function useDataFromEventLogs() {
  const [electionData, setElectionData] = useState<any>()

  useEffect(() => {
    async function fetch() {
      /* TODO: need to reverse */
      const logs = (await get('factory/logs')).data
      const elections: ElectionData[] = await Promise.all(
        logs.map(async (log: any) => {
          const decodedLog = (await get('zkcream/' + log[0])).data
          /* TODO implement differetn election patterns */
          return {
            title: decodedLog.title,
            recipients: decodedLog.recipients,
            for: decodedLog.agree,
            against: decodedLog.disagree,
            owner: decodedLog.owner,
            coordinator: decodedLog.coordinator,
            zkCreamAddress: log[0],
            maciAddress: decodedLog.maciAddress,
            hash: log[1],
          }
        })
      )
      setElectionData(elections)
    }

    if (!electionData) {
      fetch()
    }
  })

  return electionData
}

// get event logs for all deployed zkcream contract
export function useAllElectionData(): ElectionData[] | [] {
  const formattedEvents = useDataFromEventLogs()

  if (formattedEvents) {
    return formattedEvents
  } else {
    return []
  }
}

// get election data of passed zkcream contract address
export function useElectionData(address: string): ElectionData | undefined {
  const allElectionData = useAllElectionData()
  return allElectionData?.find((e) => e.zkCreamAddress === address)
}
