# SPR

## Problem brief

The overarching problem is that security is both necessary and expensive,
especially for individual developers, open-source maintainers, and SMEs (small
to medium enterprises).

Amongst the threats, we prioritize open-source supply chain security for the
following reasons:

- It affects the most people. Everyone from individual developers to massive
  companies like Google rely on open-source & are therefore exposed to the risk.
- The impacts are the most severe. Libraries used in code are given the same
  privileges the code calling it. Dependencies have the same access to
  environment variables, production secrets, etc.
- Developers are a very valuable target. We often hold infrastructure secrets
  such as package registry credentials which allow attacks to spread
  organically.

## Current landscape

Historically, supply chain security companies have focused on CVE scanning,
static analysis, and containers. These approaches stem from the famous Log4Shell
attacks in 2021, where due to lack of supply chain tracking, many companies
remained unknowingly vulnerable to the CVE. As such, the approach of traditional
software supply chain startups have been to maintain a SBOM (Software bill of
materials) for companies and informing them when a version used is vulnerable.

This is where most companies such as Snyk, Socket.dev, Anchore, Cycode, and
Chainguard, JFrog, and Mend.io started. It is an extremely oversaturated market.

However, over the past two years, attacks have changed. What has become much
more common are active supply chain attacks, where malicious actors compromise
the upstream itself. Instead of a vulnerability being exploited, they are
actively created or malware directly executed on device.

Some notable incidents:

- [xz-utils - May 29, 2024](https://tukaani.org/xz-backdoor/): A backdoor was
  added to `xz-utils`, a dependency of OpenSSH which allowed for remote code
  execution using an attacker's private key.
- [Shai-Hulud - September 15, 2025](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised#affected-packages):
  A self-spreading worm in the NPM ecosystem that exfiltrated API keys and
  secrets.
- [OpenClaw Malicious Agent Skills - February 02, 2026](https://blog.virustotal.com/2026/02/from-automation-to-infection-how.html):
  A wide ranging set of NPM packages and executable markdown that caused agents
  to exfiltrate secrets or perform destructive actions.
- [TJ-Actions - March 20, 2025](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/):
  Compromise of CI/CD libraries to exfiltrate production secrets.

There's a couple dozen more, but those are the more famous ones.

In the case of active attacks, scanning and alerting are no longer effective, as
by the time they are detected, the exploitation would've already succeeded.

Of the supply chain security companies, 2 have tried to adapt: JFrog and
Chainguard. Chainguard Libraries is an alternative NPM registry where everything
is reproducibly built and JFrog Curation is a policy-driven registry based on
CVEs and manually flagged malicious packages.

I'll mostly be focusing on Chainguard as a competitor as they are closest to
what we're building.

### The pain points

- **Too few packages**: For individual developers and SMEs, it is prohibitively
  expensive to build major software in-house. With how many packages projects
  depend on, if even one package is missing, they're unlikely to use the
  product.
- **Insufficient features**: While reproducible builds do prevent certain
  classes of supply chain attacks, such as registry account compromises, source
  attacks aren't at all uncommon. Both `xz-utils` and `tj-actions` amongst many
  other had malicious code as part of source release or in source.
- **Pricing** is arbitrary and quote-based. Companies like Chainguard don't even
  respond to some potential customers who request quotes if the company is too
  small.

This is mostly the result of **market segmentation**. Large enterprise customers
in regulated sectors has always been the most profitable while caring more about
**compliance over security**. They are also **maximizing profit** where extra
features which would increase security with diminishing returns are simply not
taken.

This honestly makes sense. They limit themselves to popular packages. These
popular packages have a large install base. When a supply chain attack occurs,
it will often be caught within the first few days of release. As long as no CVEs
are released around the same time as the attack, these supply chain security
companies can simply use a time delay policy to ensure that their customers
aren't affected.

### Points of competition

- **Market segmentation**: As a pre-seed startup, I think it is best to simply
  not compete. The compliance space is very different from the security space in
  approaches, goals, marketing, and thus the required experience.
- **Features and performance**: Despite infinitely smaller than the large
  existing startups, we can definitely compete on how effective our system is.
  We are not initially maximizing profit, but taking market share. This means
  that we can more freely explore better approaches to solving the problem such
  as behavioral analysis and automated reverse engineering.
- **Flexibility**: To target a larger range of markets, we need to allow
  trade-offs between security and accessibility. For example, a company in a
  regulated industry can set requirements such that they will be restricted to
  packages reproducible and signed packages while a startup can be more lax and
  demand only security.

## MVP

I've been working on bits and pieces of this project since October 2025,
starting off by talking to people in industry, academics, and startup founders.
This is currently part of my 3rd year dissertation which will be completed in
May with an MVP.

What is due to be complete:

- Reproducible builds, matching Chainguard.
- Automated test generation designed to trigger malicious behavior and
  containerized runs of these tests
- Honeypot containers to trigger exfiltration attempts
- eBPF-based data collection (in VM outside container to prevent tampering with
  report data)
- De-noise data based on known safe sample & other techniques
- Heuristics for anomaly detection
- AI analysis of behavior to build a dataset to be used for machine learning.
- Policy-driven registry proxy that handles organization rules on security and
  compliance
- Event-driven microservice architecture that scales to millions of packages
- NPM support

The goal of the MVP is the build the core technology without excessive
specialization. While I have spoken to a number of interested parties, we lack a
real controlled market study for marketing and final direction.

## Market study and possible directions

The product was designed and built with the assumption of primarily targeting
SMEs with individual developers and open-source as a marketing ploy to get wider
adoption. This would entail GitHub integration to make it easy to switch over
from NPM or other registries and offering a sort of free-tier for open-source
developers. The expectation would be that the registry would be used throughout
the whole pipeline, from the developer machine to CI/CD.

However, a new market has recently emerged. With the popularity of OpenClaw and
similar projects, "normies" and non-technical enthusiasts are now suddenly
managing their own infrastructure and therefore exposed to the same supply chain
attacks as enterprises. It is not yet known what the propensity to spend is for
those users, but given the high risk nature of those agents with access to
sensitive emails and internal networks, there is definitely a demand for
security.

Once the MVP is complete, the most important task is to conduct a series of
marketing experiments to determine a more specific target customer.

Another thing to consider is vendor lock-in. For technical reasons, there is
near 0 vendor lock-in for package registries as they are designed to be easily
configured to use alternate sources. This initially benefits us as a startup
since our superior product can easily steal customers from companies like
Chainguard. However, as we grow, we will need a moat beyond technical capability
to survive. While the chances are low, there are murmurs of AI dropping the cost
of software to zero.

On this aspect, I can envision several features that would allow us to create
lock-in:

- Infrastructure-based threat modeling and policy: The premise is that not all
  CVEs are important. The risk of a vulnerability strongly depends on exposure.
  A data processing app will not care about SQL injection from the user. Based
  on a per-project threat model and an estimated effort to correct breaking
  changes, we can tune alerts to reduce alert fatigue.
- GitHub integration to prevent attacks at source: Open-source maintainers and
  companies that release open-source benefit significantly from pull requests.
  Occasionally, malicious code gets slip in via pull requests either by means of
  typosquatting, dependency confusion, or simply hidden malicious code (GitHub
  automatically hides generated code in `.gitattributes`). We can reuse our core
  behavioral anomaly detection system there as a layer of validation.
- Runtime protection and managed servers

## Risks and failure cases

- Chainguard could pivot towards the mid-market and take our ideas
- Low willingness to pay in consumer or SMEs despite registered interest
- Infrastructure scales with package volume. Economies of scale apply and our
  fixed costs per-package are much higher than variable costs of distribution.

Again, I believe that vendor lock-in is important to prevent our lunch from
being eaten. As of now, Chainguard and the like move too slow to pose a threat.
Chainguard libraries was announced October 2025 and still in private beta.
Anything other than reproducible builds and containers are not their specialty.
Once we release and start growing, we need to move fast towards capturing the
mid-market before anyone can copy our ideas and compete. I have experience
filing a patent at Huawei, and it may be worth it to do so here too.

## Plausible pivots in case of failure

While I have high confidence in success, I am not a blind risk taker. The
current code is designed such that the core can be maximally reused. For
example, the eBPF anomaly detection core can be reused for a lightweight EDR
(endpoint detection and response) targeted towards self-hosting. Combine that
with the container orchestration done for reproducible builds & behavioral data
collection and we can also build a well thought out agent sandboxing layer for a
more secure alternative to OpenClaw (that's where the money is isn't it). Though
I'm less enthusiastic about that as I much prefer building practical things that
solve a real problem over chasing hype.

Worst case scenario and everything must be thrown away, I still have an excess
of ideas that I'll never have the time to finish.
