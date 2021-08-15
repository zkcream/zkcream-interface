import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { isAddress } from '@ethersproject/address'
import styled from 'styled-components'
import { QRCode } from 'react-qr-svg'

import { genKeypair } from 'maci-crypto'
import { PubKey, PrivKey } from 'maci-domainobjs'
import { Box, Flex, Text } from 'rebass/styled-components'
import { Label, Radio, Checkbox } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary, ButtonInverse, ButtonNav } from '../Button'
import { AutoColumn } from '../Column'
import Candidates from './Candidates'
import Modal from '../Modal'
import { RowFixed } from '../Row'
import { useDeployModalToggle } from '../../state/application/hooks'
import { useElections, useSetElections } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'
import { FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { fetchContractDetails } from '../../utils/api'
import { post } from '../../utils/api'

// import { useDeployCallback } from '../../state/election/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const RadioRabel = styled(Label)`
  line-height: 1.5rem;
`

const MaciSkText = styled(Text)`
  font-weight: bold;
  word-break: break-all;
`

const QRContaier = styled.div`
  padding-top: 1rem;
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
  const { account } = useWeb3React()
  const [txState, setTxState] = useState<any>('Deploy')
  const [maciSk, setMaciSk] = useState<string>()
  const [showMaciSk, setShowMaciSk] = useState<boolean>(false)
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])
  const [checked, setChecked] = useState<boolean>(false)

  const toggleModal = useDeployModalToggle()
  const elections = useElections()
  const setElections = useSetElections()

  // set electionType 2 as default since type 0 ~ 1 are not implemented yet
  const [electionType, setElectionType] = useState<string>('2')

  const [values, setValues] = useState({ for: '', against: '' })
  const { value: title, bind: bindTitle } = useInput('')
  const { value: coordinatorPubkey, setValue: setCoodinatorPubkey, bind: bindCoordinaotrPubkey } = useInput('')

  const disabled = !isAddress(values['for']) || !isAddress(values['against'])

  // const { deployCallback } = useDeployCallback()

  async function onDeploy(e: any) {
    e.preventDefault()
    setTxState('Creating...')

    const election = {
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

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  function generateQR(maciSk: string) {
    return (
      <QRContaier>
        <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{ width: 256, marginBottom: 20 }} value={maciSk} />
      </QRContaier>
    )
  }

  function generateNewKeypair() {
    setMaciSk(undefined)
    const { pubKey, privKey } = genKeypair()
    const pk = new PubKey(pubKey)
    const sk = new PrivKey(privKey)
    setCoodinatorPubkey(pk.serialize())
    setMaciSk(sk.serialize())
  }

  return (
    <>
      {showMaciSk ? (
        <Box>
          <Box mb={20}>
            <Text fontWeight="bold">
              <Trans>Your coordinator Private key</Trans>
            </Text>
          </Box>
          <RowFixed style={{ width: '100%' }}>
            {patterns.map((pattern, i) => (
              <ButtonNav disabled={nav === pattern} onClick={toggleNav} key={i}>
                {pattern}
              </ButtonNav>
            ))}
          </RowFixed>
          <Box m={10}>
            {nav === patterns[0] ? (
              <>
                <Box mb={10}>
                  <Text>
                    <Trans>Coordinator Private key:</Trans>
                  </Text>
                </Box>
                <MaciSkText>{maciSk}</MaciSkText>
              </>
            ) : (
              <Text>{generateQR(maciSk!)}</Text>
            )}
          </Box>
          <Box pb={3}>
            <Label>
              <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
              <Trans>I've stored my coordinator Private key</Trans>
            </Label>
          </Box>
          <Box>
            <ButtonPrimary disabled={!checked} onClick={toggleModal}>
              <Text>Clear Data</Text>
            </ButtonPrimary>
          </Box>
        </Box>
      ) : (
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
              <ButtonInverse borderRadius={'2rem'} padding={'5px'} width={'160px'} onClick={generateNewKeypair}>
                <Trans>New keypair</Trans>
              </ButtonInverse>
            </Flex>
            <FormInput type="text" {...bindCoordinaotrPubkey} />
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
            <ButtonPrimary
              value={txState}
              disabled={txState !== 'Deploy' || !electionType || disabled}
              onClick={onDeploy}
            >
              <Trans>Deploy</Trans>
            </ButtonPrimary>
          </Box>
        </Box>
      )}
    </>
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
