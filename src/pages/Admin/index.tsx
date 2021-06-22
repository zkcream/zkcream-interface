import React, { useEffect, useState } from 'react'

import { useInput } from '../../utils/inputs'
import { useFactoryContract, useVotingTokenContract, useZkCreamContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { ElectionData, useAllElectionData } from '../../state/election/hooks'

export default function Admin() {
  const [owner, setOwner] = useState(null)
  const [txState, setTxState] = useState('Submit')
  const [electionAddress, setElectionAddress] = useState<string | undefined>(undefined)
  const [votingTokenAddress, setVotingTokenAddress] = useState<string | undefined>(undefined)

  const { value: voterAddress, bind: bindVoterAddress, reset: resetVoterAddress } = useInput('')

  const { account } = useActiveWeb3React()
  const factoryContract = useFactoryContract()

  /* Set contract instance */
  const zkCreamContract = useZkCreamContract(electionAddress as string)
  const votingTokenContract = useVotingTokenContract(votingTokenAddress as string)

  useEffect(() => {
    async function getOwner() {
      const o = await factoryContract.owner()
      setOwner(o)
    }
    getOwner()
  }, [factoryContract])

  useEffect(() => {
    async function getVotingTokenContractAddress() {
      /* VotingToken address */
      if (electionAddress) {
        const address = await zkCreamContract.votingToken()
        setVotingTokenAddress(address)
      }
    }
    getVotingTokenContractAddress()
  }, [electionAddress, votingTokenAddress, zkCreamContract])

  async function onTransfer(e: any) {
    e.preventDefault()
    setTxState('Transfering...')

    if (votingTokenContract && votingTokenContract.address === votingTokenAddress) {
      /* Transfer Token */
      const r = await votingTokenContract.giveToken(voterAddress)
      if (r.status) {
        await r.wait()
      }
    } else {
      throw new Error('error')
    }

    setTxState('Submit')
    resetVoterAddress()
  }

  async function handleOnChange(value: string) {
    setElectionAddress(value)
  }

  const allElections: ElectionData[] = useAllElectionData()

  return (
    <>
      {owner && owner === account ? (
        <>
          <form onSubmit={onTransfer}>
            <select value={electionAddress} onChange={(e) => handleOnChange(e.target.value)}>
              <option></option>
              {allElections.map((election, i) => (
                <option key={i} value={election.zkCreamAddress}>
                  {election.title}
                </option>
              ))}
            </select>
            <input type="text" {...bindVoterAddress} />
            <input type="submit" value={txState} disabled={txState !== 'Submit'} />
          </form>
        </>
      ) : (
        <>You are not admin</>
      )}
    </>
  )
}
