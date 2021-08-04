import React, { useState } from 'react'
import styled from 'styled-components'
// import { genKeypair } from 'maci-crypto'
import { Keypair, PrivKey } from 'maci-domainobjs'
import { Box, Flex } from 'rebass/styled-components'
import { Label, Radio } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../Button'
import { AutoColumn } from '../Column'
import Candidates from './Candidates'
import Modal from '../Modal'
import { FormInput } from '../../theme'
import { useInput, useAddressInput } from '../../utils/inputs'
import { post } from '../../utils/api'

// import { useDeployCallback } from '../../state/election/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const RadioRabel = styled(Label)`
  line-height: 1.5rem;
`

const SubmitButton = styled.input`
  border: none;
  color: ${({ theme }) => theme.greyText};
  padding: 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  :disabled {
    opacity: 0.5;
  }
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
  // set electionType 2 as default since type 0 ~ 1 are not implemented yet
  const [electionType, setElectionType] = useState<string>('2')
  const [recipients, setRecipients] = useState<[]>()
  const { value: title, bind: bindTitle, reset: resetTitle } = useInput('')
  const {
    value: coordinatorAddress,
    bind: bindCoordinatorAddress,
    reset: resetCoordinatorAddress,
    isEthAddress: isCoordinatorAddressCorrectFormat,
  } = useAddressInput('')

  const disabled = !isCoordinatorAddressCorrectFormat

  /* TODO: download privKey OR show QR code */
  //const { privKey } = genKeypair()
  const coordinatorPrivKey: string = process.env.REACT_APP_COORDINATOR_PRIVKEY!
  const coordinator = new Keypair(new PrivKey(BigInt(coordinatorPrivKey)))

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

    // TODO
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
    setTxState('Deploy')
  }

  return (
    <Box py={3}>
      <Box pb={3}>
        <Label fontWeight="bold">
          <Trans>Election Title</Trans>
        </Label>
        <FormInput type="text" {...bindTitle} />
      </Box>
      <Box pb={3}>
        <Label fontWeight="bold">
          <Trans>Coordinator Ethereum Address</Trans>
        </Label>
        <FormInput type="text" {...bindCoordinatorAddress} />
      </Box>
      <Box pb={3}>
        <Label fontWeight="bold" pb={2}>
          <Trans>Election Type</Trans>
        </Label>
        {selections.map((selection, i) => (
          <RadioRabel key={i}>
            <Radio
              name="electionType"
              value={i}
              onChange={(e) => setElectionType(e.target.value)}
              checked={electionType === '2' ? true : false}
              disabled={i.toString() !== electionType ? true : false}
            />
            <Trans>{selection}</Trans>
          </RadioRabel>
        ))}
      </Box>
      <Candidates electionType={electionType as string} setRecipients={setRecipients} />
      <Flex>
        <Box>
          <ButtonPrimary
            value={txState}
            disabled={txState !== 'Deploy' || !electionType || disabled}
            onClick={onDeploy}
          >
            <Trans>Deploy</Trans>
          </ButtonPrimary>
        </Box>
      </Flex>
    </Box>
  )
}

export default function DeployModal({ isOpen, onDismiss }: DeployModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper gap="lg">
        <DeployForm />
      </ContentWrapper>
    </Modal>
  )
}
