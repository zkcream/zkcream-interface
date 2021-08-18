import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { useProcessMessageCallback } from '../../hooks/useProcessMessageCallback'
import { FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
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
  const [, processMessage] = useProcessMessageCallback()

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

  return (
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
            <QrReader delay={300} onError={(e) => console.error(e)} onScan={handleScan} />
          )}
        </Box>
      )}
    </Box>
  )
}
