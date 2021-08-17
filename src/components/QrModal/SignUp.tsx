import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { useSignUpCallback } from '../../hooks/useSignUpCallback'
import { black, FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
import Spinner from '../Spinner'

interface SignUpReaderProps {
  patterns: string[]
  nav: string
  zkCreamAddress: string
  maciAddress: string
}

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

export default function SignUp({ patterns, nav, zkCreamAddress, maciAddress }: SignUpReaderProps) {
  const [noteReceived, setNoteReceived] = useState<boolean>(false)
  const { value: note, bind: bindNote, reset: resetNote } = useInput('')

  const [txState, signUpIndex, maciSk, signUp] = useSignUpCallback(zkCreamAddress, maciAddress)

  function submit() {
    setNoteReceived(true)
    signUp(note).then(() => resetNote)
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

  return (
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
            <ButtonPrimary onClick={submit}>
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
              <QrReader delay={300} onError={(e) => console.error(e)} onScan={handleScan} />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
