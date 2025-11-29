# On Supply Chain Security

## A brief history and motivation

The first major supply chain attack came in 2013, when the supermarket chain, Target, was breached with malware that collected credit card details from their POS systems via their HVAC supplier. The attack showed how privileged access to systems by partners and contractors increased the attack surface, leading to improvements in access control and scoping [[1]](#references).

The frequency of supply chain attacks has since increased, bleeding over from just a pivoting method, into the open source landscape. In fact, between just 2019 and 2022, software supply chain attacks skyrocketed by an astounding 742% [[2]](#references).

<img alt="Supply chain attacks graph 2019-2024" title="Supply chain attack chart per SonaType [[3]](#references)" src="https://r2.duti.dev/blog/images/attacks-chart.png" width="700">

### Recent notable incidents:

- **Log4Shell**: Was a critical vulnerability in `Log4j` leading to RCE. The main problem exhibited was a lack of tracking of the software supply chain, making it difficult to determine whether something was vulnerable. This incident lead to the standardization of Software Bill of Materials (SBOM) and creation of CycloneDX as an ECMA specification [[4]](#references), [[5]](#references).
- **XZ Utils backdoor**: Maintainer turned bad. With full control over the repository, build process, and releases, "Jia Tan" was able to inject a backdoor specifically into OpenSSH. This attack highlighted the risk of developer burnout and social engineering as well as non-reproducible builds. [[7]](#references)
- **Tj-actions**: Demonstrated that the supply chain isn't just limited to your package dependencies. CI/CD is also a target as well as all its dependencies. [[6]](#references)
- **NPM Shai-Hulud Worm**: Put into practice an attack I pondered almost 2 years ago [[8]](#references) - Instead of targeting users, target developers who hold sensitive info like API keys and use that to spread across the open source landscape. The work successfully spread across 500+ NPM packages with millions of downloads including large enterprises like Crowdstrike's packages [[9]](#references).

## Problem definition

The root cause of supply chain attacks is ultimately a problem of incentives and trust. From a purely economic perspective, open source maintainers do not make sense. 60% of open source maintainers are unpaid hobbyists [[10]](#references) with no incentive to maintain quality beyond reputation. Even then, with 20% of contributors choosing to remain anonymous [[11]](#references), there is zero risk associated with conducting an attack.

Past proposals such as the initial draft of the EU's Cyber Resilience Act have focused on punishing maintainers with extra legal work and risk of fines [[12]](#references) in a way analogous to me throwing food in a food bin, a corporate idiot taking food out of the bin, eating it, getting food poisoning, and then asking the government to sue me. The only possible outcome of the initial draft legislation would have been abandonment of open source projects. Why would anyone deanonymize just to make it easier to get sued?

The ideal outcome would be companies collectively funding the development of open source software such that maintainers are given incentives to continue their good work. However, with projects having 683 median transitive dependencies [[13]](#references), the legal overhead cost of establishing a legal relationship with each contributor far outweighs the realistic payouts.

## Existing solutions

This problem is partially solved by large companies. For example, Huawei has a whole department dedicated to security review of their supply chains. When a project requires the use of a library not in its existing artifact repository, developers must send an official request for it to be added. This then kicks off a complex process of code review and CI/CD work to automate building those dependencies from source. Finally, once this is done, the version is frozen and placed into the artifact repository. Developers are forbidden from pulling directly from `npm` or `Cargo`, instead pulling only reviewed and trusted code. [[14]](#references)

This process is expensive and generally impossible to implement at small to medium companies, and maybe even for large non-tech ones. There is also a lot of duplicate work being done by the various large players in FAANG.

It is also difficult for companies to open up their current cache and collaborate. Making your supply chain known makes it easier to target attacks and for abuse of copyleft licenses to be known. Caches would also only include dependencies used by that company where with limited resources, it is unlikely for the queue to be fairly prioritized. Geopolitics is also a growing factor in distrust between large companies with government affiliation.

Our primary competitor in the space will be [Socket](https://socket.dev). Their approach uses AI to automatically scan all repositories for malicious patterns. Due to the inaccuracy of AI, there are significant false positives. Furthermore, their approach of security scanning rather than a trusted registry only allows for retroactive notifications after a compromise has already occurred. (We do secretly hope to be acquired by Socket)

## Envisioned solution

We assume that potential customers already have a software product but without existing processes for securing the supply chain.

- They supply us with a [CycloneDX](https://cyclonedx.org/) bill of materials which is the industry standard [[15]](#references)
- We assume the source code to be initially safe. We build up the baseline behavior of the dependency in both installation and usage tests.
- We create a reproducible build pipeline for the package
- We host the artifacts built from source on our registry

Then, on a continuous basis:

- Monitor maintainership patterns of the repository. For example, a change in maintainers, sudden unsigned commits, etc.
- Compare behavior with previous baselines (e.g. No new network connections or suspicious file reads)
- Review the diffs, either automatically with LLMs or manually via a designated maintainer (similar to the Debian model). Reviews are to be documented such that each change is justified.
- When a new release is made, do a deeper review of artifacts and finally mirror the release with a reproducibly built artifact.
- Flag releases made without a corresponding CI/CD run.

From the customer's perspective, they simply generate their SBOM, provide it to us, and switch their package registry away from npm, PyPi, etc to use our secure version.

## Community engagement and collaboration

Our solution moves the burden of trust from hundreds of open source developers to us. With such high trust requirements, transparency is of utmost importance. From a technical standpoint, this is simple: just open source the core components and reproducible build pipelines such that our work can be validated. However, it remains difficult to prove that a proper code review was conducted and to be able to trace the reasoning behind passes and flags. I believe a major aspect of this will be documentation. What we need is a good interface for reviewing code diffs, commenting on reasoning, and flagging suspicious code.

With a transparent and well defined process, we can also collaborate with companies such as Google and Huawei already doing such reviews to compare notes & benefit the public.

<section id="references">

## References

1. https://secarma.com/a-brief-history-of-supply-chain-attacks/
2. https://tuxcare.com/blog/supply-chain-attacks/
3. https://www.sonatype.com/hubfs/SSCR-2024/SSCR_2024-FINAL-10-10-24.pdf
4. https://ecma-international.org/publications-and-standards/standards/ecma-424/
5. Halbritter, A. and Merli, D., 2024, July. Accuracy evaluation of sbom tools for web applications and system-level software. In Proceedings of the 19th International Conference on Availability, Reliability and Security (pp. 1-9).
6. https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction
7. https://tukaani.org/xz-backdoor/
8. https://github.com/gptlang/cubiomes/commit/053dda44dfd380846104ccadfcd1b37569283bdf#diff
9. https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised
10. https://itsfoss.com/news/open-source-maintainers-unpaid/
11. https://static.carahsoft.com/concrete/files/9517/3453/9593/Wrapped_Crossing_Boundaries_Lineaje_Report_Resource.pdf
12. https://berthub.eu/articles/posts/eu-cra-best-open-source-security/
13. https://www.paolomainardi.com/posts/point-of-no-return-on-managing-software-dependencies/
14. Source: My experience as an intern
15. https://ecma-international.org/publications-and-standards/standards/ecma-424/

</section>
