import { Trans } from '@lingui/macro'
import { QRCode } from 'react-qr-svg'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { ContentData } from '.'

interface PostSignUpProps {
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

export default function PostSignUp({ patterns, nav, data }: PostSignUpProps) {
  function generateQR(signUpIndex: number, maciSk: string) {
    const qr: string = 'signUpIndex:' + signUpIndex + ',' + maciSk + ',nonce:1'
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
          <Box mb={20}>
            <Text fontWeight="bold">
              <Trans>Your sign up index</Trans>
            </Text>
            <TextWrapper>{data.signUpIndex}</TextWrapper>
          </Box>
          <Box mb={10}>
            <Text fontWeight="bold">
              <Trans>Your maci secret key</Trans>
            </Text>
            <TextWrapper>{data.maciSk}</TextWrapper>
          </Box>
          <Box mb={10}>
            <Text fontWeight="bold">
              <Trans>Your nonce</Trans>
            </Text>
            <TextWrapper>1</TextWrapper>
          </Box>
        </>
      ) : (
        <Text>{generateQR(data.signUpIndex!, data.maciSk!)}</Text>
      )}
    </>
  )
}
