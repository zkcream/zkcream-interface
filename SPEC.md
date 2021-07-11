# Specifivations
- [Specifivations](#specifivations)
  - [`election` object](#election-object)
  - [Pages](#pages)
    - [Admin](#admin)
    - [Vote](#vote)
      - [Vote Page](#vote-page)
    - [Keywords](#keywords)

## `election` object
|`electionType`| pattern| details|
|--------|------------|------------------|
|`1`|[Pick one from many](#1)|Pick ONLY one from multiple candidates (candidates >= 2)|
|`2`|[Pick multiple candidates](#2)|Pick multiple candidates (candidates >= 2)|
|`3`|[For or Against](#3)|Pick ONLY one from two candidates(for or against) (candidates == 2)|

## Pages

### Admin
* `SHOW` deployed zkcream contracts
* `CAN` distribute token to voter
* `CAN` approve tally result

### Vote
* `SHOW` deployed zkcream contracts
* `CAN` deploy new contract

#### Vote Page
* `SHOW` contract info
* `CAN` approve token
* `CAN` deposit token
  * return deposit note
* `CAN` sign up
  * pass deposit note
* `CAN` publish message
* `CAN` process message by coordinator
* `CAN` publish result

### Keywords
|keyword|detail|
|--------|------------|
|`SHOW`| contract call|
|`CAN` | required function|