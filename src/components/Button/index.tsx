import styled from 'styled-components/macro'
import { Button, ButtonProps as ButtonPropsOriginal } from 'rebass/styled-components'

type ButtonProps = Omit<ButtonPropsOriginal, 'css'>

const Base = styled(Button)<
  {
    padding?: string
    width?: string
    borderRadius?: string
    altDisabledStyle?: boolean
  } & ButtonProps
>`
  padding: ${({ padding }) => (padding ? padding : '16px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 20px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.greyText};
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
    pointer-events: none;
  }
  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);
  &:hover {
    transform: scale(0.99);
  }
  > * {
    user-select: none;
  }
  > a {
    text-decoration: none;
  }
`

export const ButtonPrimary = styled(Base)``

export const ButtonIcon = styled(Base)`
  border-radius: 50%;
  color: ${({ theme }) => theme.blackText};
  border: 1px solid;
  margin: 0.25rem;

  :disabled {
    opacity: 0.4;
    border: none;
`
