import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useProcessMessageCallback } from '../../hooks/useProcessMessageCallback'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useCoordinatorKeyModalToggle } from '../../state/application/hooks'
import { ErrorType } from '../../state/error/actions'
import { black, FormInput } from '../../theme'
import { FormatError, TxError } from '../../utils/error'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
import Error from '../Error'
import MultiLevelModal, { MultiLevelModalContent } from '../MultiLevelModal'
import Spinner from '../Spinner'

interface ReadCoordinatorKeyProps {
  patterns: string[]
  nav: string
}

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

export default function ReadCoordinatorKey({ patterns, nav }: ReadCoordinatorKeyProps) {
  const [maciSkReceived, setMaciSkReceived] = useState<boolean>(false)
  const [error, setError] = useState<ErrorType | null>(null)
  const {
    value: coordinatorPrivateKey,
    bind: bindCoordinaotrPrivateKey,
    reset: resetCoordinatorPrivateKey,
  } = useInput('')
  const [txState, randomStateLeaf, processMessage] = useProcessMessageCallback()
  const isOpen = useModalOpen(ApplicationModal.COORDINATOR_KEY)
  const toggleModal = useCoordinatorKeyModalToggle()
  const [, setMaciSk] = useLocalStorage('macisk', '')

  function submit() {
    setMaciSk(coordinatorPrivateKey)
    processMessage(coordinatorPrivateKey)
      .then(() => resetCoordinatorPrivateKey())
      .catch((e) => {
        if (e instanceof FormatError) {
          setError(ErrorType.FORMAT_ERROR)
        } else if (e instanceof TxError) {
          setError(ErrorType.TX_ERROR)
        } else {
          setError(ErrorType.UNKNOWN_ERROR)
        }
        console.error(e.message)
      })
  }

  function handleScan(maciSk: string | null) {
    if (maciSk) {
      setMaciSkReceived(true)
      if (maciSk.startsWith('macisk.')) {
        setMaciSk(coordinatorPrivateKey)
        processMessage(maciSk).then(() => {
          setError(null)
          setMaciSkReceived(false)
        })
      } else {
        setError(ErrorType.FORMAT_ERROR)
        setMaciSkReceived(false)
        return
      }
    }
  }

  return (
    <Box my={20}>
      {randomStateLeaf.randomStateLeaf !== '' ? (
        <MultiLevelModal
          isOpen={isOpen}
          onDismiss={toggleModal}
          content={MultiLevelModalContent.PostProcessMessage}
          data={randomStateLeaf!}
        />
      ) : (
        <>
          {error ? <Error error={error} /> : null}
          {nav === patterns[0] ? (
            <Box my={20}>
              <Label fontWeight="bold">
                <Trans>Please scan your QR code</Trans>
              </Label>
              {maciSkReceived ? (
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
          ) : (
            <>
              <Box my={10}>
                <Label fontWeight="bold">
                  <Trans>Coordinator Private key</Trans>
                </Label>
                <FormInput {...bindCoordinaotrPrivateKey} />
              </Box>
              <Box my={20}>
                <ButtonPrimary onClick={submit} disabled={txState}>
                  {txState ? <Spinner color={black} height={16} width={16} /> : <Trans>Submit</Trans>}
                </ButtonPrimary>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}
