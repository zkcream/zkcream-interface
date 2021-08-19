import { Trans } from '@lingui/macro'
import { QRCode } from 'react-qr-svg'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { ContentData } from '.'

interface CoordinatorKeyProps {
  patterns: string[]
  nav: string
  data: ContentData
}

const MaciSkText = styled(Text)`
  font-weight: bold;
  word-break: break-all;
`

const QRContaier = styled.div`
  padding-top: 1rem;
`

export default function CoordinatorKey({ patterns, nav, data }: CoordinatorKeyProps) {
  function generateQR(maciSk: string) {
    return (
      <QRContaier>
        <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{ width: 256, marginBottom: 20 }} value={maciSk} />
      </QRContaier>
    )
  }

  return (
    <Box m={10}>
      {nav === patterns[0] ? (
        <>
          <Box my={10}>
            <Text>
              <Trans>Coordinator Private key:</Trans>
            </Text>
          </Box>
          <MaciSkText>{data?.maciSk}</MaciSkText>
        </>
      ) : (
        <Text>{generateQR(data.maciSk!)}</Text>
      )}
    </Box>
  )
}
