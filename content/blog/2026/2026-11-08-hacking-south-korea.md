+++
title = "Hacking South Korea's National Cyber Security Center"
+++

How? DNS Hijacking. How? Expired nameservers. No DNSSEC.

Some logs from September:

```plain
yuu@fishy ~ > dig ncsc.go.kr NS @c.dns.kr.

; <<>> DiG 9.20.30 <<>> ncsc.go.kr NS @c.dns.kr.
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 63757
;; flags: qr rd; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 2
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;ncsc.go.kr.			IN	NS

;; ANSWER SECTION:
ncsc.go.kr.		180	IN	NS	ns1.aegis-k.com.
ncsc.go.kr.		180	IN	NS	ns2.aegis-k.com.
ncsc.go.kr.		180	IN	NS	ns.ncsc.go.kr.

;; ADDITIONAL SECTION:
ns.ncsc.go.kr.		180	IN	A	210.99.169.131

;; Query time: 141 msec
;; SERVER: 210.101.61.1#53(c.dns.kr.) (UDP)
;; WHEN: Sun Sep 08 04:48:00 JST 2026
;; MSG SIZE  rcvd: 72

```

```plain
yuu@fishy ~ > rdap aegis-k.com
Error: Object not found (404)
```

Probably the most stupid way to get hacked. The attack vector entered academic
literature all the way back in 2016 [1] and a bunch of them were discovered and
fixed in 2017 [2]. The UAE was hacked in 2018 [3] via DNS hijacking and a bunch
of others in 2019 [4].

A couple months ago, I saw that [Lina](https://lina.sh)'s post on
[how an expired nameserver let them log hundreds of thousands of phone calls to military bases](https://lina.sh/blog/hijacking-e164-arpa)
[5]. That was sorta what triggered me to take a brief look.

Everyone always targets the US and Europe since I guess they're more familiar
and have more transparency. The US publishes a list of all government domains
[6] and so that also makes it fairly easy to automate.

Was using certificate transparency in some other projects so I thought why not
use that for a list of all global government domains. Surely a problem that's
been around for so long has been fixed at this point.

Well, no. Just for expired nameservers, I got ~21 hits. South Korea had the most
straight forward disclosure process and fixed the issue within 2 months, so good
for them.

Don't bother looking for the others. I paid a couple hundred dollars to register
all the expired nameservers so nobody else could.

Anyways, this could've been bad. Intercepting mail, internal traffic, and
whatnot especially for the place where government vulnerabilities are reported
would've been fun if I didn't jump the gun and register the domains with my
credit card instead of crypto.

P.s. The other countries aren't really responding. Maybe I should be handing
this to ICANN or something? Don't have contacts, too lazy to bother. If there's
an email I can just ping with the list that'd be nice.

P.s.2 Lots of queries from Australia for Chinese government domains for some
reason. Suspicious.

Been looking a bit more into government stuff since, and so so many stupid shit
like this. Anything from running ancient vulnerable versions of things to
unauthenticated internal shit visible on certificate transparency. "AI too
powerful" -> nah the world is just too fragile.

## References

- [1]
  <https://www.computer.org/csdl/proceedings-article/sp/2016/0824a691/12OmNxRF739>
- [2] <https://securitee.org/files/dnshijack_ccs2017.pdf>
- [3]
  <https://blog.talosintelligence.com/dnspionage-campaign-targets-middle-east/>
- [4] <https://blog.talosintelligence.com/seaturtle/>
- [5] <https://lina.sh/blog/hijacking-e164-arpa>
- [6] <https://get.gov/about/data/>
