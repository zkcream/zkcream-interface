import styled from 'styled-components/macro'
import { Button, ButtonProps as ButtonPropsOriginal } from 'rebass/styled-components'
import { darken, lighten } from 'polished'

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
  border-radius: 0.25rem;
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

export const ButtonPrimary = styled(Base)`
  color: ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.primary};
  :disabled {
    opacity: 0.25;
  }
`

export const ButtonInverse = styled(Base)`
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.primary};
  :disabled {
    opacity: 0.25;
  }
  &:hover {
    color: ${({ theme }) => theme.black};
    background: ${({ theme }) => theme.primary};
  }
`

export const ButtonNav = styled(Base)`
  margin: auto;
  color: ${({ theme }) => theme.greyText};
  border: none;
  border-radius: 10em;
  background: ${({ theme }) => lighten(0.4, theme.greyText)};
  :disabled {
    color: ${({ theme }) => theme.black};
    background: ${({ theme }) => theme.primary};
  }
`

export const ButtonIcon = styled(Base)`
  background: ${({ theme }) => darken(0.03, theme.darkBackgraound)};
  border-radius: 10px;
  color: ${({ theme }) => theme.primary};
  margin: 0.25rem;
  padding: .8rem;
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.darkBackgraound)};
  }
  :disabled {
    opacity: 0.4;
    border: none;
`
