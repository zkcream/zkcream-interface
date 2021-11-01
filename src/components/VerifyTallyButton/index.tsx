import { Trans } from '@lingui/macro'
import { useVerifyTally } from '../../hooks/useVerifyTally'
import { black } from '../../theme'
import { ButtonPrimary } from '../Button'
import Spinner from '../Spinner'

export default function VerifyTallyButton({
  verified,
  setVerifiedState,
}: {
  verified: any
  setVerifiedState: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [verifyTxState, verifyTally] = useVerifyTally()

  return (
    <ButtonPrimary onClick={() => verifyTally(setVerifiedState)} disabled={verified}>
      {verifyTxState ? <Spinner color={black} height={16} width={16} /> : <Trans>Verify Tally</Trans>}
    </ButtonPrimary>
  )
}
