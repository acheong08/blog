+++
title = "Juniors, 內卷, and KPIs"
+++

This is an unstructured rant, sparked by a review comment I had to make:

```plain
That's literal insanity.

1. You're literally gonna have to compile Go for every database
   entry??? `go run` is not free. We're not doing Python here.
2. Refactoring is gonna be a nightmare. Add 1 new field to the Generate
   function? A few thousand files to edit. Golang doesn't have defaults.
3. It doesn't lend itself well to automation. We're not gonna be sending .go
   files around via an API that's just insecure.
4. We will probably want to parse the data. For example, using dependabot to
   automatically bump versions when necessary & open a PR. Having it in Go means
   somehow dealing with the AST or using regex. Shouldn't have to explain why
   that's bad.
```

Reviewing code... I've seen some absolutely horrific design decisions over the
past couple of months - from reinventing sockets and threading by recursively
`excve` self which then communicates back via streaming to a temporary text
file, to having an 8-parameter static configuration instead be Golang that reads
its own source code as configuration to then generate a Containerfile, and a
100+ line script that does the equivalent to `mkdir x && touch x/.gitkeep`.

Junior developers are much more creative than LLMs in creating the most
nonsensical abstractions. This extends beyond just bad university grads that
never turn up to lectures. I see it most often from "good" programmers that can
solve Leetcode Hards even I can't.

## Experience

> Disclaimer: My perspective is very specifically from the perspective of UK,
> mid-tier universities. Looking at very "_normal_" people who are smart but not
> geniuses.

The main problem I see is lack of experience. Those developers have never
maintained anything for over a month, extend beyond the initial feature set
imagined, experimented with different approaches to a problem, or even had real
users.

In theory, a computer science/software engineering degree is meant to be a good
substitute for lived experience. Lecturers with real world experience would
impart their knowledge and shape the taste of the students, designate long-term
projects, and provide feedback like a user or coworker.

In reality, this simply doesn't work. The industry pays so ridiculously well
that most who remain in academia are either researchers or those who couldn't
make it (at least in 2nd and 3rd tier universities). There isn't much real world
experience passed down and trust is too low.

Due to the semester and module system of universities, projects rarely last over
a month and maintainability is an afterthought. Assessments do not scale. There
is no bandwidth to evaluate the quality of submissions from hundreds of
students. Instead, we write reports as a proxy for code quality. I wrote about
[how that lends itself to AI slop and is a bad proxy here](/blog/2025/ai-is-tempting/).
Finally, still no users.

Getting an internship is probably the best way to gain experience. Though this
advice doesn't help much these days. The influx of computer science students has
meant the competition is insanely high. You either have to be very lucky or have
prior experience to land one.

To compete for the dwindling number of positions, I see a lot of students
grinding Leetcode in preparation for interviews. I'd say that's a completely
wrong approach - a holdover from the COVID era where companies would just hire
anyone who passed the bar. Being good at solving very well defined and self
contained problems is a commodity now, not just because of AI, but because of
the sheer volume of new grads doing the exact same thing.

I'm obviously biased, but I think that public projects, preferably open-source,
are the best way to accumulate experience. Maintaining libraries with actual
dependents teach you how to design API surfaces, minimize breaking changes, and
structure for long term maintainability. Having other contributors to your
projects teach you how to do code review and have a good testing pipeline to
reduce manual work.

Of course, it's not easy to just "do open-source" successfully. A lot boils down
to being able to identify trends _before_ they hit mainstream and jump on it
early, identifying niches without competition, and maintaining a level of trust.
Competing with existing projects is near impossible when you're just starting
out. So be as early as possible or as niche as possible, and solve a real
problem.

That is how you both get experience "for free" and generally get better at
working with people.

The other substitute for experience is reading. Even if "outdated" from a
technical perspective, the more valuable lesson is the approach to solving
problems, things to keep in mind, and the more social aspect of experience that
is hard to get from just documentation.

Beyond books, just knowing what exists is also massively helpful. Many problems
don't have to be solved from scratch. Just knowing that constraint programming
_exists_ has won me 2 hackathons (lot more effort involved but you get my
point). There are various forums such as
[HackerNews](https://news.ycombinator.com/) that have a fair number of
experienced people discussing articles. Read the article first, then read what
people say. Ignore the short unjustified opinions. Look for people talking about
their real life experience. No need to memorize, just have it in the back of
your mind. Quite often, I'm working on a problem & I remember a post describing
how a related problem was solved which I can then look for and reference.

## 內卷 (Involution)

Explained simply, it's a system where members continuously increase inputs
(time, effort, money) to compete for limited resources, yet aggregate output
remains stagnant, while individual returns actually decrease.

What I've essentially said above is that people aren't competing hard enough or
in the right way.
