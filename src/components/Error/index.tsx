import React from 'react'
import { lighten } from 'polished'
import styled from 'styled-components'

import { ErrorType } from '../../state/error/actions'

const ErrorWrapper = styled.div`
  background-color: ${({ theme }) => lighten(0.5, theme.darkBackgraound)};
  border-radius: 0.25rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  margin-bottom: 1rem;
`

export default function Error({ error }: { error: ErrorType | null }) {
  return <>{error != null ? <ErrorWrapper>{ErrorType[error]}</ErrorWrapper> : null}</>
}
