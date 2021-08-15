import styled from 'styled-components'
import { Box } from 'rebass'
import { Label } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { ButtonPrimary } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import Spinner from '../Spinner'
import { useAddressInput } from '../../utils/inputs'
import { useElectionState } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'
import { FormInput, black } from '../../theme'
import { useSendTokenCallback } from '../../hooks/useSendTokenCallback'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

interface DistributeModalProps {
  isOpen: boolean
  onDismiss: () => void
}

function DistributeForm() {
  const electionData: ElectionData | undefined = useElectionState()
  const [txState, sendToken] = useSendTokenCallback(electionData?.votingTokenAddress as string)

  const {
    value: voterAddress,
    bind: bindVoterAddress,
    reset: resetEthAddresss,
    isEthAddress: isValidEthAddress,
  } = useAddressInput('')

  return (
    <Box>
      <Box mb={20}>
        <Label fontWeight="bold">
          <Trans>Ethereum Address</Trans>
        </Label>
        <FormInput type="text" {...bindVoterAddress} />
      </Box>
      <Box>
        <ButtonPrimary disabled={!isValidEthAddress} onClick={() => sendToken(voterAddress).then(resetEthAddresss)}>
          {txState ? <Spinner color={black} height={16} width={16} /> : <Trans>Send Token</Trans>}
        </ButtonPrimary>
      </Box>
    </Box>
  )
}

export default function DistributeModal({ isOpen, onDismiss }: DistributeModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper gap="lg">
        <DistributeForm />
      </ContentWrapper>
    </Modal>
  )
}
