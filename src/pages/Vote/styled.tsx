import { Trans } from '@lingui/macro'
import styled, { DefaultTheme } from 'styled-components'
import { VotingState } from '../../state/election/actions'

const handleColorType = (status: VotingState, theme: DefaultTheme) => {
  switch (status) {
    case VotingState.ACTIVE:
      return theme.blue
    case VotingState.FINISHED:
      return theme.green
    default:
      return theme.greyText
  }
}

function StatusText({ status }: { status: VotingState }) {
  switch (status) {
    case VotingState.ACTIVE:
      return <Trans>Active</Trans>
    case VotingState.FINISHED:
      return <Trans>Finished</Trans>
    default:
      return <Trans>Undetermined</Trans>
  }
}

const StyledElectionContainer = styled.span<{ status: VotingState }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ status, theme }) => handleColorType(status, theme)};
  border: 1px solid ${({ status, theme }) => handleColorType(status, theme)};
  width: fit-content;
  justify-self: flex-end;
`

export function ElectionStatus({ status }: { status: VotingState }) {
  return (
    <StyledElectionContainer status={status}>
      <StatusText status={status} />
    </StyledElectionContainer>
  )
}
