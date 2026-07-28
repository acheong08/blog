+++
title = "Wikimedia attack: 2026-03-05"
+++

Today, Wikipedia was in read-only mode for a couple of hours due to a security
incident.

Post from WMF staff member on Discord:

> Hey all - as some of you have seen, we (WMF) were doing a security review of
> the behavior of user scripts, and unintentionally activated one that turned
> out to be malicious. That is what caused the page deletions you saw on the
> Meta log, which are getting cleaned up. We have no reason to believe any
> third-party entity was actively attacking us today, or that any permanent
> damage occurred or any breach of personal information.
>
> We were doing this security review as part of an effort to limit the risks of
> exactly this kind of attack. The irony of us triggering this script while
> doing so is not lost on us, and we are sorry about the disruption. But the
> risks in this system are real. We are going to continue working on security
> protections for user scripts – in close consultation with the community, of
> course – to make this sort of thing much harder to happen in the future.

You can read up on some sources here:

- [https://wikipediocracy.com/forum/viewtopic.php?f=8&t=14555](https://wikipediocracy.com/forum/viewtopic.php?f=8&t=14555)
- [https://phabricator.wikimedia.org/T419143](https://phabricator.wikimedia.org/T419143)
- [https://old.reddit.com/r/wikipedia/comments/1rllcdg/megathread_wikimedia_wikis_locked_accounts/](https://old.reddit.com/r/wikipedia/comments/1rllcdg/megathread_wikimedia_wikis_locked_accounts/)

## What the script did

> Wow. This worm is fascinating. It seems to do the following:
>
> - Inject itself into the MediaWiki:Common.js page to persist globally, and
>   into the User:Common.js page to do the same as a fallback
> - Uses jQuery to hide UI elements that would reveal the infection
> - Vandalizes 20 random articles with a 5000px wide image and another XSS
>   script from basemetrika.ru
> - If an admin is infected, it will use the Special:Nuke page to delete 3
>   random articles from the global namespace, AND use the Special:Random with
>   action=delete to delete another 20 random articles
>
> EDIT! The Special:Nuke is really weird. It gets a default list of articles to
> nuke from the search field, which could be any group of articles, and
> rubber-stamps nuking them. It does this three times in a row.

Source: [nhubbard on ycombinator](https://news.ycombinator.com/item?id=47264202)

For some reason, basemetrika.ru was not a registered domain. I have now
registered it and thus hopefully nobody else will be able to use it for
malicious purposes.

This was not an active attack but simply a mistake by a wikimedia admin.

If the wikimedia foundation would like to take the domain off me, they can
contact me at [acheong@duti.dev](mailto:acheong@duti.dev).
