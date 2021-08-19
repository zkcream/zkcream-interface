import { Trans } from '@lingui/macro'
import { QRCode } from 'react-qr-svg'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { ContentData } from '.'

interface PostProcessMessageProps {
  patterns: string[]
  nav: string
  data: ContentData
}

const TextWrapper = styled(Text)`
  font-weight: bold;
  word-break: break-all;
`

const QRContaier = styled.div`
  padding-top: 1rem;
`

export default function PostProcessMessage({ patterns, nav, data }: PostProcessMessageProps) {
  function generateQR(randomStateLeaf: string) {
    const qr: string = 'rsl:' + randomStateLeaf
    return (
      <>
        <QRContaier>
          <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{ width: 256, marginBottom: 20 }} value={qr} />
        </QRContaier>
      </>
    )
  }

  return (
    <>
      {nav === patterns[0] ? (
        <>
          <Box my={10}>
            <Text fontWeight="bold">
              <Trans>Current random state leaf</Trans>
            </Text>
            <TextWrapper>{data.randomStateLeaf}</TextWrapper>
          </Box>
        </>
      ) : (
        <Text>{generateQR(data.randomStateLeaf!)}</Text>
      )}
    </>
  )
}
