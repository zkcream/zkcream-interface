import { Box } from 'rebass'
import { Label } from '@rebass/forms'
import { Trans } from '@lingui/macro'

import { useSendTokenCallback } from '../../hooks/useSendTokenCallback'
import { useElectionState } from '../../state/election/hooks'
import { ElectionData } from '../../state/election/reducer'
import { useAddressInput } from '../../utils/inputs'
import Spinner from '../Spinner'
import { ButtonPrimary } from '../Button'
import { FormInput, black } from '../../theme'

interface DistributeProps {
  toggleModal: () => void
}

export default function Distribute({ toggleModal }: DistributeProps) {
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
          <Trans>Voter's Address</Trans>
        </Label>
        <FormInput type="text" {...bindVoterAddress} />
      </Box>
      <Box>
        <ButtonPrimary
          disabled={!isValidEthAddress || txState}
          onClick={() => sendToken(voterAddress).then(resetEthAddresss).then(toggleModal)}
        >
          {txState ? <Spinner color={black} height={16} width={16} /> : <Trans>Send Token</Trans>}
        </ButtonPrimary>
      </Box>
    </Box>
  )
}
