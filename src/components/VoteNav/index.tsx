import React from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/macro'

export enum MessageAction {
  SELECT,
  NEWKEY,
}

export const ActionNames = [
  [MessageAction.SELECT, 'Select'],
  [MessageAction.NEWKEY, 'New Key'],
]

interface VoteNavProps {
  radioState: MessageAction
  handleChange: (e: any) => void
}

const RadioButtonGroup = styled.div`
  display: flex;
  margin: 1rem auto;
  width: 280px;
`

const RadioItem = styled.div`
  width: 100%;
  &:first-of-type {
    label {
      border-top-left-radius: 2rem;
      border-bottom-left-radius: 2rem;
    }
  }
  &:last-of-type {
    label {
      border-top-right-radius: 2rem;
      border-bottom-right-radius: 2rem;
    }
  }
`

const RadioInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;

  &:checked {
    + label {
      background: black;
      color: white;
    }
  }
`

const RadioButtonLabel = styled.label`
  cursor: pointer;
  border: 1px solid black;
  display: block;
  margin-right: -2px;
  padding: 1rem;
  text-align: center;
`

export function VoteNav({ radioState, handleChange }: VoteNavProps) {
  return (
    <RadioButtonGroup>
      {ActionNames.map((action, index) => (
        <RadioItem key={index}>
          <RadioInput
            onChange={handleChange}
            type="radio"
            name="action"
            value={index}
            id={action[1] as string}
            checked={radioState === action[0]}
          />
          <RadioButtonLabel htmlFor={action[1] as string}>
            <Trans>{action[1]}</Trans>
          </RadioButtonLabel>
        </RadioItem>
      ))}
    </RadioButtonGroup>
  )
}
