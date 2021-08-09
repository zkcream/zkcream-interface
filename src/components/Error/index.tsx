import React from 'react'
import { lighten } from 'polished'
import styled from 'styled-components'

import { ErrorType } from '../../state/error/actions'

const ErrorWrapper = styled.div`
  background-color: ${({ theme }) => lighten(0.5, theme.darkBackgraound)};
  color: ${({ theme }) => theme.white};
  font-size: 0.9rem;
  width: 100%;
  padding: 0.25rem;
  text-align: center;
  margin-bottom: 1rem;
`

export default function Error({ error }: { error: ErrorType | null }) {
  return <>{error != null ? <ErrorWrapper>{ErrorType[error]}</ErrorWrapper> : null}</>
}
