import { Trans } from '@lingui/macro'
import { useEffect } from 'react'
import { useState } from 'react'
import { Box, Text } from 'rebass'
import styled from 'styled-components'
import { TimeLeft } from '../../state/election/reducer'

interface CountdownClockProps {
  beforeDeadlineOf: string | null
  limit: TimeLeft | null
}

const ClockWrapper = styled(Box)`
  width: 290px;
  color: ${({ theme }) => theme.greyText};
`

export default function CountdownClock({ beforeDeadlineOf, limit }: CountdownClockProps) {
  const { days = 0, hours = 0, minutes = 0, seconds = 60 } = limit!
  const [[day, hour, min, sec], setTime] = useState([days, hours, minutes, seconds])

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
          {beforeDeadlineOf === 'signUp' ? (
            <Trans>Sign up deadline until:</Trans>
          ) : (
            <Trans>Voting deadline until:</Trans>
          )}
        </Text>
      </Box>
      <Box>
        <Text fontWeight={600} textAlign={'right'}>
          {`${day.toString()} day ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${Math.round(
            sec
          )
            .toString()
            .padStart(2, '0')}`}
        </Text>
      </Box>
    </ClockWrapper>
  )
}
