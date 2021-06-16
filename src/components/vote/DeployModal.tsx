import React, { useState } from 'react'
import { genKeypair } from 'maci-crypto'
import { Keypair, PrivKey } from 'maci-domainobjs'

import Candidates from './Candidates'
import Modal from '../Modal'
import { useInput } from '../../hooks/inputs'
import { post } from '../../utils/api'

import { useDeployCallback } from '../../state/election/hooks'

interface DeployModalProps {
  isOpen: boolean
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

  //const { deployCallback } = useDeployCallback()

  async function onDeploy() {
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

    //const r = await deployCallback(data)
    //console.log(r)
    await post('factory/deploy', data)

    resetTitle()
    resetCoordinatorAddress()
    setTxState('Deploy')
  }

  function handleOnChange(value: string) {
    setElectionType(value)
  }

  return (
    <form onSubmit={onDeploy}>
      <label>
        Title:
        <input type="text" {...bindTitle} />
      </label>
      <label>
        Coordinator:
        <input type="text" {...bindCoordinatorAddress} />
      </label>
      <label>
        Type:
        <select value={electionType} onChange={(e) => handleOnChange(e.target.value)}>
          <option></option>
          {selections.map((selection, i) => (
            <option key={i} value={i}>
              {selection}
            </option>
          ))}
        </select>
      </label>
      <Candidates electionType={electionType as string} setRecipients={setRecipients} />
      <input type="submit" value={txState} disabled={txState !== 'Deploy' || !electionType} />
    </form>
  )
}

export default function DeployModal({ isOpen }: DeployModalProps) {
  return (
    <Modal isOpen={isOpen}>
      <DeployForm />
    </Modal>
  )
}
