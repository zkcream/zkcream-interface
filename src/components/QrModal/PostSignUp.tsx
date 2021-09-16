import { Trans } from '@lingui/macro'
import { QRCode } from 'react-qr-svg'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { ContentData } from '.'
import Copy from '../Copy'

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
  // TEMP fixed nonce
  // const nonce = data.nonce ? data.nonce : 1
  const nonce = 1

  function generateQR(signUpIndex: number, maciSk: string, nonce: number) {
    const qr: string = 'signUpIndex:' + signUpIndex + ',' + maciSk + ',nonce:' + nonce
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
        <Text>{generateQR(data.signUpIndex!, data.maciSk!, nonce)}</Text>
      ) : (
        <>
          <Box my={10}>
            <Text fontWeight="bold">
              <Trans>Your sign up index</Trans>
            </Text>
            <TextWrapper>
              <Copy toCopy={data.signUpIndex?.toString()!}>{data.signUpIndex!}</Copy>
            </TextWrapper>
          </Box>
          <Box mb={10}>
            <Text fontWeight="bold">
              <Trans>Your maci secret key</Trans>
            </Text>
            <TextWrapper>
              <Copy toCopy={data.maciSk!}>{data.maciSk}</Copy>
            </TextWrapper>
          </Box>
          <Box mb={10}>
            <Text fontWeight="bold">
              <Trans>Your nonce</Trans>
            </Text>
            <TextWrapper>
              {/* <Copy toCopy={nonce.toString()}>{nonce}</Copy> */}
              <Text>{nonce}</Text>
            </TextWrapper>
          </Box>
        </>
      )}
    </>
  )
}
