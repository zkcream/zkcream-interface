import { useCallback, useState } from 'react'
import { Log } from '@ethersproject/abstract-provider'

import { useVotingTokenContract } from './useContract'
import { useActiveWeb3React } from './web3'

export function useTransferEvents(
  votingTokenAddress: string
): [log: Array<Log> | undefined, callback: () => Promise<void>] {
  const { library } = useActiveWeb3React()
  const [log, setLog] = useState<Array<Log>>()
  const votingTokenContract = useVotingTokenContract(votingTokenAddress)

  const c = useCallback(async () => {
    await library!
      .getLogs({
        ...votingTokenContract.filters.Transfer(),
        fromBlock: 0,
      })
      .then(async (r: Array<Log>) => {
        setLog(r)
      })
      .catch((e: Error) => {
        console.log('transfer event log error', e.message)
        throw e
      })
  }, [library, votingTokenContract.filters])

  return [log, c]
}
