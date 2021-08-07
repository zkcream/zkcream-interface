import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

export const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`

export const FormInput = styled.input`
  width: 100%;
  font-size: 1rem;
  padding: 12px;
  border: 1px solid;
  border-radius: 0.25rem;
  line-height: 1rem;
  :focus {
    border: 1px solid ${({ theme }) => theme.primary};
    outline: none;
  }
`
