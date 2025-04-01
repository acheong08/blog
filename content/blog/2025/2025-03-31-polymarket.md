+++
title = "The \"UMA scam\""
+++

I stumbled into this rabbit hole after a crypto hackathon at Oxford, which, to no surprise, was teeming with scammers. I ended up with about $100 in random tokens, which I swapped for ETH. Since KYC wasn't an option, I decided to check out Polymarket to see what all the fuss was about. I was surprised to find that many markets closed with objectively false outcomes, which prompted me to dig a little deeper.
<hr/>

`UMA` is the oracle used by [Polymarket](https://polymarket.com/) to verify claims and settle disputes.

## How it works

- A statement is proposed as true with a bond of $750
- 2 rounds of disputes can be raised against one another, each costing $750.
- If no disputes are raised within the time limit, the latest statement is considered true.
- When a resolution cannot be reached, human UMA voters determine the outcome on a majority basis.

![Oracle system diagram](https://2020722513-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FKdaoNjf9AzgWFNHyPo5b%2Fuploads%2FQpaIpBCOAA9CoWX2lbVH%2FAsserterupdatemarch.png?alt=media)

## It doesn't work

- Due to the price of the bond, the dispute structure intrinsically prices out smaller players.
- Voters are not incentivized to reach the correct conclusion but rather align with the majority.
- Due to the time limited nature of outcome proposals and disputes, a conflict cannot simply "wait" until more information is available.

## The scam

- In low volume markets with many small individuals players, a whale can simply assert a false resolution as it costs up to $1500 just to reach human UMA voters.
- Ambiguous rules are often inserted in contracts that make the resolution opinion based rather than factual. A common one is "If it's unclear ..., this market will resolve to the side with the stronger argument based on credible reporting." where "credible reporting" are occasionally controlled by participants themselves.
- A user can propose 2 nearly identical markets, one with significantly less volume than the other. By proposing a resolution in the market with less volume and thus less attention, there is a high likelihood of it being automatically closed without disputes. The closing of that market can then be used as evidence to support a similar resolution on the higher volume market even if the resolution is not objective truth.
