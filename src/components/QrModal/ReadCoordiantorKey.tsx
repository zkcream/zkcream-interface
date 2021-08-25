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
import { black, FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
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
    processMessage(coordinatorPrivateKey).then(() => resetCoordinatorPrivateKey())
  }

  function handleScan(maciSk: string | null) {
    if (maciSk) {
      setMaciSkReceived(true)
      if (maciSk.startsWith('macisk.')) {
        setMaciSk(coordinatorPrivateKey)
        processMessage(maciSk).then(() => setMaciSkReceived(false))
      } else {
        console.log('Wrong format')
        setMaciSkReceived(false)
        return
      }
    }
  }

  return (
    <Box mb={20}>
      {randomStateLeaf.randomStateLeaf !== '' ? (
        <MultiLevelModal
          isOpen={isOpen}
          onDismiss={toggleModal}
          content={MultiLevelModalContent.PostProcessMessage}
          data={randomStateLeaf!}
        />
      ) : (
        <>
          {nav === patterns[0] ? (
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
