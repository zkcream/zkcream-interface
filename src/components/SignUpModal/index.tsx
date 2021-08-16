import { memo, useState } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'
import { QRCode } from 'react-qr-svg'
import { Box, Text } from 'rebass/styled-components'
import { Checkbox, Label } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary, ButtonNav } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowFixed } from '../Row'
import Spinner from '../Spinner'
import { useInput } from '../../utils/inputs'
import { useSignUpCallback } from '../../hooks/useSignUpCallback'
import { FormInput, black } from '../../theme'
import { StateIndex } from '../../state/election/reducer'
import { useActiveWeb3React } from '../../hooks/web3'
import { useFetchTokenState } from '../../state/token/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

const TextWrapper = styled(Text)`
  font-weight: bold;
  word-break: break-all;
`

const QRContaier = styled.div`
  padding-top: 1rem;
`

interface SignUpModalProps {
  zkCreamAddress: string
  maciAddress: string
  isOpen: boolean
  onDismiss: () => void
}

export const SignUpModal = memo(({ zkCreamAddress, maciAddress, isOpen, onDismiss }: SignUpModalProps) => {
  const { account } = useActiveWeb3React()
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])
  const [checked, setChecked] = useState<boolean>(false)
  const [noteReceived, setNoteReceived] = useState<boolean>(false)

  const { value: note, bind: bindNote, reset: resetNote } = useInput('')

  const [txState, signUpIndex, maciSk, signUp] = useSignUpCallback(zkCreamAddress, maciAddress)
  const arg: any = { zkCreamAddress, account }
  const fetchTokenState = useFetchTokenState(arg)

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  function handleError(e: any) {
    console.error(e)
  }

  function submitNote() {
    setNoteReceived(true)
    signUp(note).then(() => resetNote())
    setNoteReceived(false)
  }

  function handleScan(data: string | null) {
    const prefix = 'note:'
    if (data) {
      setNoteReceived(true)
      if (data.startsWith(prefix)) {
        const note = data.replace(prefix, '')
        signUp(note).then(() => setNoteReceived(false))
      } else {
        console.log('Wrong format')
        setNoteReceived(false)
        return
      }
    }
  }

  function generateQR(signUpIndex: StateIndex, maciSk: string) {
    const qr: string = 'signUpIndex:' + signUpIndex + ',' + maciSk + ',nonce:1'
    return (
      <>
        <QRContaier>
          <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{ width: 256, marginBottom: 20 }} value={qr} />
        </QRContaier>
      </>
    )
  }

  function closeModal() {
    window.localStorage.clear()
    fetchTokenState()
    onDismiss()
  }

  function getModalContent() {
    return (
      <Box>
        {signUpIndex !== '0' ? (
          <Box>
            <Box mb={20}>
              <Text fontWeight="bold">
                <Trans>Vote status</Trans>
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
                  <Box mb={20}>
                    <Text fontWeight="bold">
                      <Trans>Your sign up index</Trans>
                    </Text>
                    <TextWrapper>{signUpIndex}</TextWrapper>
                  </Box>
                  <Box mb={10}>
                    <Text fontWeight="bold">
                      <Trans>Your maci secret key</Trans>
                    </Text>
                    <TextWrapper>{maciSk}</TextWrapper>
                  </Box>
                  <Box mb={10}>
                    <Text fontWeight="bold">
                      <Trans>Your nonce</Trans>
                    </Text>
                    <TextWrapper>1</TextWrapper>
                  </Box>
                </>
              ) : (
                <Text>{generateQR(signUpIndex!, maciSk)}</Text>
              )}
              <Box pb={3}>
                <Label>
                  <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
                  <Trans>I've stored my deposit note</Trans>
                </Label>
              </Box>
              <Box>
                <ButtonPrimary disabled={!checked} onClick={closeModal}>
                  <Text>Clear Information</Text>
                </ButtonPrimary>
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            <Box mb={20}>
              <Text fontWeight="bold">
                <Trans>Deposit Note</Trans>
              </Text>
            </Box>
            <RowFixed style={{ width: '100%' }}>
              {patterns.map((pattern, i) => (
                <ButtonNav disabled={nav === pattern} onClick={toggleNav} key={i}>
                  {pattern}
                </ButtonNav>
              ))}
            </RowFixed>
            <Box my={20}>
              {nav === patterns[0] ? (
                <>
                  {noteReceived ? (
                    <LoadingMessageWrapper>
                      <Spinner />
                      <Text>
                        <Trans>Submitting....</Trans>
                      </Text>
                    </LoadingMessageWrapper>
                  ) : (
                    <>
                      <Label fontWeight="bold">
                        <Trans>Note text</Trans>
                      </Label>
                      <FormInput {...bindNote} />
                    </>
                  )}
                  <Box my={20}>
                    <ButtonPrimary onClick={submitNote}>
                      {txState && signUpIndex === '0' ? (
                        <Spinner color={black} height={16} width={16} />
                      ) : (
                        <Trans>Submit note</Trans>
                      )}
                    </ButtonPrimary>
                  </Box>
                </>
              ) : (
                <>
                  <Box my={20}>
                    <Label fontWeight="bold">
                      <Trans>Scan your barcode</Trans>
                    </Label>
                    {noteReceived ? (
                      <LoadingMessageWrapper>
                        <Spinner />
                        <Text>
                          <Trans>Reading....</Trans>
                        </Text>
                      </LoadingMessageWrapper>
                    ) : (
                      <QrReader delay={300} onError={handleError} onScan={handleScan} />
                    )}
                  </Box>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    )
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper>{getModalContent()}</ContentWrapper>
    </Modal>
  )
})
