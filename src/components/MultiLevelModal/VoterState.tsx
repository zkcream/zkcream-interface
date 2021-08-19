import { Trans } from '@lingui/macro'
import { ArrowLeft } from 'react-feather'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { StyledInternalLink } from '../../theme'
import QrModal, { QrModalContent } from '../QrModal'

interface VoterstateProps {
  toggleModal: () => void
  setStateIndex: React.Dispatch<any>
  setNonce: React.Dispatch<any>
  setMaciSk: React.Dispatch<any>
}

const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  color: ${({ theme }) => theme.greyText};
`

export default function VoterState({ toggleModal, setStateIndex, setNonce, setMaciSk }: VoterstateProps) {
  return (
    <Box>
      <ArrowWrapper to={'/'}>
        <ArrowLeft size={20} />
        <Trans>Back to All Elections</Trans>
      </ArrowWrapper>
      <Box my={20}>
        <Text fontWeight="bold">
          <Trans>Voter State</Trans>
        </Text>
        <Text>
          <Trans>Please provide your voting state informations</Trans>
        </Text>
      </Box>
      <QrModal
        toggleModal={toggleModal}
        content={QrModalContent.VoterState}
        setStateIndex={setStateIndex}
        setNonce={setNonce}
        setMaciSk={setMaciSk}
      />
    </Box>
  )
}
