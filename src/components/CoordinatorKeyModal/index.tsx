import { useState } from 'react'
import { Box, Text } from 'rebass/styled-components'
import { Label } from '@rebass/forms'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'
import { Trans } from '@lingui/macro'

import { ButtonPrimary, ButtonNav } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowFixed } from '../Row'
import Spinner from '../Spinner'
import { useInput } from '../../utils/inputs'
import { FormInput } from '../../theme'
import { useProcessMessageCallback } from '../../hooks/useProcessMessageCallback'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

interface CoordinatorKeyModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export function CoordinatorKeyModal({ isOpen, onDismiss }: CoordinatorKeyModalProps) {
  const patterns = ['Text', 'QR Code']
  const [nav, setNav] = useState<string>(patterns[0])
  const [maciSkReceived, setMaciSkReceived] = useState<boolean>(false)
  const [, processMessage] = useProcessMessageCallback()

  const {
    value: coordinatorPrivateKey,
    bind: bindCoordinaotrPrivateKey,
    reset: resetCoordinatorPrivateKey,
  } = useInput('')

  function toggleNav() {
    const op: number = nav === patterns[0] ? 1 : 0
    setNav(patterns[op])
  }

  function handleError(e: any) {
    console.error(e)
  }

  function submit() {
    processMessage(coordinatorPrivateKey).then(() => resetCoordinatorPrivateKey())
  }

  function handleScan(maciSk: string | null) {
    if (maciSk) {
      setMaciSkReceived(true)
      if (maciSk.startsWith('macisk.')) {
        processMessage(maciSk).then(() => setMaciSkReceived(false))
      } else {
        console.log('Wrong format')
        setMaciSkReceived(false)
        return
      }
    }
  }

  function getModalContent() {
    return (
      <Box>
        <Box mb={20}>
          <Text fontWeight="bold">
            <Trans>Coordinator Private key</Trans>
          </Text>
        </Box>
        <RowFixed style={{ width: '100%' }}>
          {patterns.map((pattern, i) => (
            <ButtonNav disabled={nav === pattern} onClick={toggleNav} key={i}>
              {pattern}
            </ButtonNav>
          ))}
        </RowFixed>
        <Box mb={20}>
          {nav === patterns[0] ? (
            <>
              <Box>
                <Label fontWeight="bold">
                  <Trans>Coordinator Private key</Trans>
                </Label>
                <FormInput {...bindCoordinaotrPrivateKey} />
              </Box>
              <Box my={20}>
                <ButtonPrimary onClick={submit}>
                  <Trans>Submit</Trans>
                </ButtonPrimary>
              </Box>
            </>
          ) : (
            <Box my={20}>
              <Label fontWeight="bold">
                <Trans>Scan your barcode</Trans>
              </Label>
              {maciSkReceived ? (
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
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper gap="lg">{getModalContent()}</ContentWrapper>
    </Modal>
  )
}
