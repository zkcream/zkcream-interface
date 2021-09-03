import { Trans } from '@lingui/macro'
import { useEffect } from 'react'
import { useState } from 'react'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { DateProps } from '../../state/election/reducer'

interface CountdownClockProps {
  beforeSignUpDeadline: boolean
  limit: DateProps
}

const ClockWrapper = styled(Box)`
  width: 290px;
  color: ${({ theme }) => theme.greyText};
`

export default function CountdownClock({ beforeSignUpDeadline, limit }: CountdownClockProps) {
  const { d = 0, h = 0, m = 0, s = 60 } = limit
  const [[day, hour, min, sec], setTime] = useState([d, h, m, s])

  function reset() {
    setTime([day, hour, min, sec])
  }

  function tick() {
    if (day === 0 && hour === 0 && min === 0 && sec === 0) reset()
    else if (hour === 0 && min === 0 && sec === 0) {
      setTime([day - 1, 23, 59, 59])
    } else if (min === 0 && sec === 0) {
      setTime([day, hour - 1, 59, 59])
    } else if (sec === 0) {
      setTime([day, hour, min - 1, 59])
    } else {
      setTime([day, hour, min, sec - 1])
    }
  }

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000)
    return () => clearInterval(timerId)
  })

  return (
    <ClockWrapper>
      <Box>
        <Text fontSize={['12px']} textAlign={'right'}>
          {beforeSignUpDeadline ? <Trans>Sign up deadline until:</Trans> : <Trans>Voting deadline until:</Trans>}
        </Text>
      </Box>
      <Box>
        <Text fontWeight={600} textAlign={'right'}>
          {`${day.toString()} day ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec
            .toString()
            .padStart(2, '0')}`}
        </Text>
      </Box>
    </ClockWrapper>
  )
}
