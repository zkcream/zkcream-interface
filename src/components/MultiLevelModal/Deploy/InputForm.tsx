import { Trans } from '@lingui/macro'
import { Label, Radio } from '@rebass/forms'
import { useWeb3React } from '@web3-react/core'
import { genKeypair } from 'maci-crypto'
import { PrivKey, PubKey } from 'maci-domainobjs'
import { useState } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { useElections, useSetElections } from '../../../state/election/hooks'
import { ElectionData } from '../../../state/election/reducer'
import { FormInput } from '../../../theme'
import { isAddress } from '../../../utils'
import { fetchContractDetails, post } from '../../../utils/api'
import { useInput } from '../../../utils/inputs'
import { ButtonInverse, ButtonPrimary } from '../../Button'
import { MaciSk } from '../../QrModal'
import Candidates from '../Candidates'

const RadioRabel = styled(Label)`
  line-height: 1.5rem;
`

type SelectionType = string[]
const types: SelectionType = [
  'One from many', // Pick ONLY one from multiple candidates (candidates >= 2)
  'Multiple candidate', // Pick multiple candidates (candidates >= 2)
  'For or Against', // Pick ONLY one from two candidates(for or against) (candidates == 2)
]

interface ElectionForm {
  title: string
  electionType: string
  recipients: string[]
}

interface InputFormProps {
  setMaciSk: React.Dispatch<React.SetStateAction<MaciSk>>
  setShowMaciSk: React.Dispatch<React.SetStateAction<boolean>>
}

export default function InputForm({ setMaciSk, setShowMaciSk }: InputFormProps) {
  const { account } = useWeb3React()
  const [electionType, setElectionType] = useState<string>('2')
  const [txState, setTxState] = useState<string>('Deploy')
  const [values, setValues] = useState({ for: '', against: '' })
  const { value: title, bind: bindTitle } = useInput('')
  const { value: coordinatorPubkey, setValue: setCoodinatorPubkey, bind: bindCoordinaotrPubkey } = useInput('')
  const disabled = !isAddress(values['for']) || !isAddress(values['against'])
  const elections = useElections()
  const setElections = useSetElections()

  async function deploy(setShowMaciSk: any) {
    setTxState('Deploying...')
    const election: ElectionForm = {
      title,
      electionType,
      recipients: [values['for'], values['against']],
    }
    const hash = await post('ipfs', election)
    // TODO
    const data = {
      initial_voice_credit_balance: 100,
      merkle_tree_height: 4,
      coordinator_pubkey: PubKey.unserialize(coordinatorPubkey).asContractParam(),
      coordinator_address: account,
      recipients: election.recipients,
      ipfsHash: hash.data.path,
    }
    //await deployCallback(data)
    const r = await post('factory/deploy', data)
    const deployedLog = r.data.events[6].args // ['contractAddress', 'ipfsHash']
    const newContractData: ElectionData = await fetchContractDetails(deployedLog)
    const temp = Object.assign([], elections)
    temp.unshift(newContractData)
    setElections(temp)
    setTxState('Deploy')
    setShowMaciSk(true)
  }

  function genMaciKeypair() {
    setMaciSk({ maciSk: '' })
    const { privKey, pubKey } = genKeypair()
    const sk = new PrivKey(privKey)
    const pk = new PubKey(pubKey)
    setCoodinatorPubkey(pk.serialize)
    setMaciSk({ maciSk: sk.serialize() })
  }

  return (
    <>
      <Box py={3}>
        <Box pb={3}>
          <Label fontWeight="bold">
            <Trans>Election Title</Trans>
          </Label>
          <FormInput type="text" {...bindTitle} />
        </Box>
        <Box pb={3}>
          <Flex pb={2}>
            <Label fontWeight="bold">
              <Trans>Coordinator's public key</Trans>
            </Label>
            <ButtonInverse borderRadius={'2rem'} padding={'5px'} width={'160px'} onClick={genMaciKeypair}>
              <Trans>New keypair</Trans>
            </ButtonInverse>
          </Flex>
          <FormInput type="text" {...bindCoordinaotrPubkey} />
        </Box>
        <Box pb={3}>
          <Label fontWeight="bold" pb={2}>
            <Trans>Election Type</Trans>
          </Label>
          {types.map((type, i) => (
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
                  <Trans>{type}</Trans>
                </RadioRabel>
              ) : null}
            </div>
          ))}
        </Box>
        <Candidates electionType={electionType as string} values={values} setValues={setValues} />
        <Box>
          <ButtonPrimary
            value={txState}
            disabled={txState !== 'Deploy' || !electionType || disabled}
            onClick={() => deploy(setShowMaciSk)}
          >
            <Trans>Deploy</Trans>
          </ButtonPrimary>
        </Box>
      </Box>
    </>
  )
}
