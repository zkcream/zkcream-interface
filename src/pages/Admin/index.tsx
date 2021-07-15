import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Text } from 'rebass'
import { Input, Label, Select } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { useInput } from '../../utils/inputs'
import { useFactoryContract, useVotingTokenContract, useZkCreamContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllElectionData } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'

const SubmitButton = styled.input`
  background-color: grey;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
`

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
        <Box as="form" onSubmit={onTransfer}>
          <Flex mb={20}>
            <Box width={1}>
              <Label fontWeight="bold">Election</Label>
              <Select value={electionAddress} onChange={(e) => handleOnChange(e.target.value)}>
                <option></option>
                {allElections.map((election, i) => (
                  <option key={i} value={election.zkCreamAddress}>
                    {election.title}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
          <Flex mb={20}>
            <Box>
              <Label fontWeight="bold">
                <Trans>Ethereum Address</Trans>
              </Label>
              <Input type="text" {...bindVoterAddress} />
            </Box>
          </Flex>
          <Flex>
            <SubmitButton type="submit" value={txState} disabled={txState !== 'Submit'} />
          </Flex>
        </Box>
      ) : (
        <Text fontSize={3} fontWeight="bold" color="red">
          <Trans>You are not admin</Trans>
        </Text>
      )}
    </>
  )
}
