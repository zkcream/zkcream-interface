import { Trans } from '@lingui/macro'
import { Label } from '@rebass/forms'
import { useState } from 'react'
import QrReader from 'react-qr-reader'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { usePublishTallyCallback } from '../../hooks/usePublishTallyCallback'
import { FormInput } from '../../theme'
import { useInput } from '../../utils/inputs'
import { ButtonPrimary } from '../Button'
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
  const [dataReceived, setDataReceived] = useState<boolean>(false)
  const { value: randomStateLeaf, bind: bindRandomStateLeaf, reset: resetRandomStateLeaf } = useInput('')

  const publishTally = usePublishTallyCallback()

  function submit() {
    publishTally(randomStateLeaf).then(() => resetRandomStateLeaf())
  }

  function handleScan(data: string | null) {
    if (data) {
      setDataReceived(true)
      if (data.startsWith('rsl:')) {
        const randomStateLeaf = data.replace('rsl:', '')
        publishTally(data).then(() => setDataReceived(false))
      } else {
        console.log('Wrong format')
        setDataReceived(false)
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
              <Trans>Random state leaf</Trans>
            </Label>
            <FormInput {...bindRandomStateLeaf} />
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
      )}
    </Box>
  )
}
