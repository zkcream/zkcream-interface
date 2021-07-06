import React, { memo, useState } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass/styled-components'
import { Input } from '@rebass/forms'

import { ButtonPrimary } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowFixed } from '../Row'
import { useInput } from '../../utils/inputs'
import { useSignUpCallback } from '../../hooks/useSignUpCallback'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

interface SignUpModalProps {
  address: string
  isOpen: boolean
  onDismiss: () => void
}

export const SignUpModal = memo(({ address, isOpen, onDismiss }: SignUpModalProps) => {
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])
  const [noteReceived, setNoteReceived] = useState<boolean>(false)

  const { value: note, bind: bindNote, reset: resetNote } = useInput('')

  const signUp = useSignUpCallback(address)

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  function handleError(e: any) {
    console.error(e)
  }

  function submitNote() {
    setNoteReceived(true)
    try {
      signUp(note)
    } catch (e) {
      throw new Error(e.message)
    }
    resetNote()
    setNoteReceived(false)
  }

  /* TODO */
  function handleScan(data: string | null) {
    if (data) {
      setNoteReceived(true)
    }
    console.log(data)
  }

  function getModalContent() {
    return (
      <Box>
        <Box mb={20}>
          <Text fontWeight="bold">Deposit Note</Text>
        </Box>
        <RowFixed style={{ width: '100%' }}>
          {patterns.map((pattern, i) => (
            <ButtonPrimary disabled={nav === pattern} onClick={toggleNav} key={i}>
              {pattern}
            </ButtonPrimary>
          ))}
        </RowFixed>
        <Box my={20}>
          {nav === patterns[0] ? (
            <>
              {noteReceived ? <Text>Submitting....</Text> : <Input {...bindNote} />}
              <Box my={20}>
                <ButtonPrimary onClick={submitNote}>Submit note</ButtonPrimary>
              </Box>
            </>
          ) : (
            <>
              <Box my={20}>
                <Text textAlign={'center'} my={20}>
                  Please scan your barcode
                </Text>
                {noteReceived ? (
                  <Text>Reading....</Text>
                ) : (
                  <QrReader delay={300} onError={handleError} onScan={handleScan} />
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper>{getModalContent()}</ContentWrapper>
    </Modal>
  )
})
