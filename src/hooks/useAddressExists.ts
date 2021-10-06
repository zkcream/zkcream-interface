import { useCallback, useEffect, useState } from 'react'
import { useElectionState } from '../state/election/hooks'
import { useTransferEvents } from './useTransferEvents'
import { useActiveWeb3React } from './web3'

export function useAddressExists(): [exists: boolean | undefined, c: () => Promise<void>, s: React.Dispatch<React.SetStateAction<boolean | undefined>>] {
  const { account, library } = useActiveWeb3React()
  const [exists, setExists] = useState<boolean | undefined>(false)
  const { votingTokenAddress }: any = useElectionState()
  const [transferLogs, fetchTransferLogs] = useTransferEvents(votingTokenAddress)

  useEffect(() => {
    fetchTransferLogs()
  }, [fetchTransferLogs])

  const c = useCallback(async () => {
    if (transferLogs) {
      for (let i = 0; i < transferLogs.length; i++) {
        if ((await library!.getTransaction(transferLogs[i].transactionHash)).from === account) {
          setExists(true)
          break
        } else {
          setExists(false)
        }
      }
    }
  }, [account, library, transferLogs])

  return [exists, c, setExists]
}
