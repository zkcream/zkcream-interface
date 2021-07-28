import React, { useState } from 'react'
import styled from 'styled-components'
import { genKeypair } from 'maci-crypto'
import { Keypair, PrivKey } from 'maci-domainobjs'
import { Box } from 'rebass/styled-components'
import { Label, Input, Select } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { AutoColumn } from '../Column'
import Candidates from './Candidates'
import Modal from '../Modal'
import { useInput } from '../../utils/inputs'
import { post } from '../../utils/api'

// import { useDeployCallback } from '../../state/election/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const SubmitButton = styled.input`
  background-color: grey;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
`

interface DeployModalProps {
  isOpen: boolean
  onDismiss: () => void
}

// define type of selection (election type)
type SelectionType = string[]
const selections: SelectionType = [
  'One from many', // Pick ONLY one from multiple candidates (candidates >= 2)
  'Multiple candidate', // Pick multiple candidates (candidates >= 2)
  'For or Against', // Pick ONLY one from two candidates(for or against) (candidates == 2)
]

function DeployForm() {
  const [txState, setTxState] = useState<any>('Deploy')
  const [electionType, setElectionType] = useState<string | undefined>()
  const [recipients, setRecipients] = useState<[]>()
  const { value: title, bind: bindTitle, reset: resetTitle } = useInput('')
  const { value: coordinatorAddress, bind: bindCoordinatorAddress, reset: resetCoordinatorAddress } = useInput('')

  /* TODO: download privKey OR show QR code */
  const { privKey } = genKeypair()
  const coordinator = new Keypair(new PrivKey(privKey))

  // const { deployCallback } = useDeployCallback()

  async function onDeploy(e: any) {
    e.preventDefault()
    setTxState('Creating...')

    const election = {
      title,
      electionType,
      recipients,
    }

    const hash = await post('ipfs', election)

    const data = {
      initial_voice_credit_balance: 100,
      merkle_tree_height: 4,
      coordinator_pubkey: coordinator.pubKey.asContractParam(),
      coordinator_address: coordinatorAddress,
      recipients: election.recipients,
      ipfsHash: hash.data.path,
    }

    //await deployCallback(data)
    await post('factory/deploy', data)

    resetTitle()
    resetCoordinatorAddress()
    setTxState('Deploy')
  }

  function handleOnChange(value: string) {
    setElectionType(value)
  }

  return (
    <Box as="form" onSubmit={onDeploy}>
      <Box>
        <Label fontWeight="bold">
          <Trans>Title</Trans>
        </Label>
        <Input type="text" {...bindTitle} />
      </Box>
      <Box>
        <Label fontWeight="bold">
          <Trans>Coordinator Ethereum Address</Trans>
        </Label>
        <Input type="text" {...bindCoordinatorAddress} />
      </Box>
      <Label fontWeight="bold">
        <Trans>Type</Trans>
      </Label>
      <Select value={electionType} onChange={(e) => handleOnChange(e.target.value)}>
        <option></option>
        {selections.map((selection, i) => (
          <option key={i} value={i}>
            {selection}
          </option>
        ))}
      </Select>
      <Candidates electionType={electionType as string} setRecipients={setRecipients} />
      <SubmitButton type="submit" value={txState} disabled={txState !== 'Deploy' || !electionType} />
    </Box>
  )
}

export default function DeployModal({ isOpen, onDismiss }: DeployModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper gap="sm">
        <DeployForm />
      </ContentWrapper>
    </Modal>
  )
}
