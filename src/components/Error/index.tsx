import { darken, lighten } from 'polished'
import styled from 'styled-components'

import { ErrorType } from '../../state/error/actions'

const ErrorWrapper = styled.div`
  background-color: ${({ theme }) => lighten(0.25, theme.red)};
  border-radius: 0.25rem;
  color: ${({ theme }) => darken(0.2, theme.red)};
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`

export default function Error({ error }: { error: ErrorType | null }) {
  return <>{error != null ? <ErrorWrapper>{ErrorType[error]}</ErrorWrapper> : null}</>
}
