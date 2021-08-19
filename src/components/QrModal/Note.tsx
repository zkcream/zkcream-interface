import { Trans } from '@lingui/macro'
import { QRCode } from 'react-qr-svg'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { ContentData } from '.'

interface NoteProps {
  patterns: string[]
  nav: string
  data: ContentData
}

const NoteText = styled(Text)`
  font-weight: bold;
  word-break: break-all;
`

const QRContaier = styled.div`
  padding-top: 1rem;
`

export default function Note({ patterns, nav, data }: NoteProps) {
  function generateQR(note: string) {
    const qr: string = 'note:' + note
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
            <Text>
              <Trans>Your Note:</Trans>
            </Text>
          </Box>
          <NoteText>{data.note}</NoteText>
        </>
      ) : (
        <Text>{generateQR(data.note!)}</Text>
      )}
    </>
  )
}
