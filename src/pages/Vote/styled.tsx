import { Trans } from '@lingui/macro'
import styled, { DefaultTheme } from 'styled-components'
import { ElectionState } from '../../state/election/hooks'

const handleColorType = (status: ElectionState, theme: DefaultTheme) => {
  switch (status) {
    case ElectionState.ACTIVE:
      return theme.blue
    case ElectionState.FINISHED:
      return theme.green
    default:
      return theme.greyText
  }
}

function StatusText({ status }: { status: ElectionState }) {
  switch (status) {
    case ElectionState.ACTIVE:
      return <Trans>Active</Trans>
    case ElectionState.FINISHED:
      return <Trans>Finished</Trans>
    default:
      return <Trans>Undetermined</Trans>
  }
}

const StyledElectionContainer = styled.span<{ status: ElectionState }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ status, theme }) => handleColorType(status, theme)};
  border: 1px solid ${({ status, theme }) => handleColorType(status, theme)};
  width: fit-content;
  justify-self: flex-end;
`

export function ElectionStatus({ status }: { status: ElectionState }) {
  return (
    <StyledElectionContainer status={status}>
      <StatusText status={status} />
    </StyledElectionContainer>
  )
}
