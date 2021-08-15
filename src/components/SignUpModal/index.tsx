import React, { memo, useState } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass/styled-components'
import { Label } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary, ButtonNav } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowFixed } from '../Row'
import Spinner from '../Spinner'
import { useInput } from '../../utils/inputs'
import { useSignUpCallback } from '../../hooks/useSignUpCallback'
import { FormInput } from '../../theme'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

interface SignUpModalProps {
  zkCreamAddress: string
  maciAddress: string
  isOpen: boolean
  onDismiss: () => void
}

export const SignUpModal = memo(({ zkCreamAddress, maciAddress, isOpen, onDismiss }: SignUpModalProps) => {
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])
  const [noteReceived, setNoteReceived] = useState<boolean>(false)

  const { value: note, bind: bindNote, reset: resetNote } = useInput('')

  const [signUpIndex, signUp] = useSignUpCallback(zkCreamAddress, maciAddress)

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

  function getModalContent() {
    return (
      <Box>
        {signUpIndex !== '0' ? (
          <>
            <Box>
              {/* TODO: Add warning text */}
              <Text fontWeight="bold">
                <Trans>Your Index</Trans> : {signUpIndex}
              </Text>
            </Box>
          </>
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
                      <Trans>Submit note</Trans>
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
