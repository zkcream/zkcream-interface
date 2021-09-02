import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { usePublishTallyCallback } from '../../hooks/usePublishTallyCallback'
import { ErrorType } from '../../state/error/actions'
import { black, FormInput } from '../../theme'
import { FormatError, TxError } from '../../utils/error'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
import Error from '../Error'
import Spinner from '../Spinner'

interface ReadRandomStateLeafProps {
  patterns: string[]
  nav: string
}

const LoadingMessageWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
`

export default function ReadRandomStateLeaf({ patterns, nav }: ReadRandomStateLeafProps) {
  const [error, setError] = useState<ErrorType | null>(null)
  const [dataReceived, setDataReceived] = useState<boolean>(false)
  const { value: randomStateLeaf, bind: bindRandomStateLeaf, reset: resetRandomStateLeaf } = useInput('')

  const [txState, publishTally] = usePublishTallyCallback()

  function submit() {
    publishTally(randomStateLeaf)
      .then(() => resetRandomStateLeaf())
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

  function handleScan(data: string | null) {
    if (data) {
      setDataReceived(true)
      if (data.startsWith('rsl:')) {
        const randomStateLeaf = data.replace('rsl:', '')
        publishTally(randomStateLeaf).then(() => {
          setError(null)
          setDataReceived(false)
        })
      } else {
        setError(ErrorType.FORMAT_ERROR)
        setDataReceived(false)
        return
      }
    }
  }

  return (
    <Box my={20}>
      {error ? <Error error={error} /> : null}
      {nav === patterns[0] ? (
        <Box my={20}>
          <Label fontWeight="bold">
            <Trans>Please scan your QR code</Trans>
          </Label>
          {dataReceived ? (
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
          {/* add result of check coordiantor */}
          {dataReceived ? (
            <LoadingMessageWrapper>
              <Spinner />
              <Text>
                <Trans>Submitting....</Trans>
              </Text>
            </LoadingMessageWrapper>
          ) : (
            <Box my={10}>
              <Label fontWeight="bold">
                <Trans>Random state leaf</Trans>
              </Label>
              <FormInput {...bindRandomStateLeaf} />
            </Box>
          )}
          <Box my={20}>
            <ButtonPrimary onClick={submit} disabled={txState}>
              {txState ? <Spinner color={black} height={16} width={16} /> : <Trans>Submit</Trans>}
            </ButtonPrimary>
          </Box>
        </>
      )}
    </Box>
  )
}
