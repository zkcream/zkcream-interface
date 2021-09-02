import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
import Spinner from '../Spinner'

interface ReadCoordinatorKeyProps {
  patterns: string[]
  nav: string
  setMaciSk: React.Dispatch<any>
}

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

export default function ReadCoordinatorKey({ patterns, nav, setMaciSk }: ReadCoordinatorKeyProps) {
  const [maciSkReceived, setMaciSkReceived] = useState<boolean>(false)
  const { value: coordinatorPrivateKey, bind: bindCoordinaotrPrivateKey } = useInput('')

  function set() {
    setMaciSk(coordinatorPrivateKey)
  }

  function handleScan(maciSk: string | null) {
    if (maciSk) {
      setMaciSkReceived(true)
      if (maciSk.startsWith('macisk.')) {
        setMaciSk(coordinatorPrivateKey)
      } else {
        console.log('Wrong format')
        setMaciSkReceived(false)
        return
      }
    }
  }

  return (
    <Box>
      <>
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
                <Trans>Coordinator's private key</Trans>
              </Label>
              <FormInput {...bindCoordinaotrPrivateKey} />
            </Box>
            <Box my={20}>
              <ButtonPrimary onClick={set}>
                <Trans>Load</Trans>
              </ButtonPrimary>
            </Box>
          </>
        )}
      </>
    </Box>
  )
}
