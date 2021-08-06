import React, { useState } from 'react'
import { isAddress } from '@ethersproject/address'
import styled from 'styled-components'

// import { genKeypair } from 'maci-crypto'
import { Keypair, PrivKey } from 'maci-domainobjs'
import { Box } from 'rebass/styled-components'
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

  const [values, setValues] = useState({ for: '', against: '' })
  const { value: title, bind: bindTitle } = useInput('')
  const {
    value: coordinatorAddress,
    bind: bindCoordinatorAddress,
    isEthAddress: isCoordinatorAddressCorrectFormat,
  } = useAddressInput('')

  const disabled = !isCoordinatorAddressCorrectFormat || !isAddress(values['for']) || !isAddress(values['against'])

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
      recipients: [values['for'], values['against']],
    }

    console.log(election)

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
          <div key={i}>
            {/* TEMP: set for or against only */}
            {i === 2 ? (
              <RadioRabel key={i}>
                <Radio
                  name="electionType"
                  value={i}
                  onChange={(e) => setElectionType(e.target.value)}
                  checked={true}
                  disabled={i.toString() !== electionType ? true : false}
                />
                <Trans>{selection}</Trans>
              </RadioRabel>
            ) : null}
          </div>
        ))}
      </Box>
      <Candidates electionType={electionType as string} values={values} setValues={setValues} />
      <Box>
        <ButtonPrimary value={txState} disabled={txState !== 'Deploy' || !electionType || disabled} onClick={onDeploy}>
          <Trans>Deploy</Trans>
        </ButtonPrimary>
      </Box>
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
