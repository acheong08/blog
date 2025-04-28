+++
title = "My uni is using AI for assessment feedback"
+++

Context: We have an freeform assignment where we basically build any mobile app we want. There are multiple stages from task overview, requirements, native APIs, the actual application code itself, and finally a retrospective. Below is the feedback for the requirements description.

```
**COMMENTS**
This music player is a highly specialized and developer-focused solution that fills a significant gap for power users who need automation and deep customization. 
Will the application has a local repository of songs, will you use database to store songs?
The functional requirements cover essential music playback features while integrating yt-dlp and Spotify-dl to streamline music discovery and downloads. 
The addition of Lua-based plugins allows for extensive personalization, making it a flexible tool for those who enjoy scripting their own features. 
However, the reliance on manual YouTube authentication and scripting may create a steep learning curve for less technical users. 
The non-functional requirements ensure strong performance, with support for large playlists and asynchronous processing, while security measures like plugin sandboxing are a thoughtful addition. 
While this app is a dream for developers looking to automate music management, a more accessible onboarding process or UI-based automation options could expand its appeal to a broader audience. Well Done!
```

Just by skimming, I could already feel the AI vibes. I also passed it into one of those detectors just to confirm (I know they aren't reliable for anything but they're using it on us anyways)

<img src="https://r2.duti.dev/blog/images/ai-detect.png" alt="Screenshot of scribbr AI detector showing 100%" width="200"/>

Beyond just the "AI vibes", it also just doesn't make sense as feedback. The feedback is on only part of a larger project where this specific bit lays out the requirements of an app I'll be building. The text simply lays out the goals and expected features and the feedback is meant to let us know whether the scope is too large, conciseness and relevance of the text, etc.

The AI also gets a lot wrong - which is probably the only good part about the feedback - that parts of it can easily be misunderstood. For example, plugins are meant to be shared & easily downloaded, rather than forcing users to code their own, but that's besides the point.

The future will be interesting with students submitting AI-generated work to receive AI feedback, fed back into the AI, and finally graded by AI. What would even be the point of an education then?

<hr>

Side note, I'm curious if there'd be any interest in an offline music player that integrates with YouTube (via Invidious API) and Spotify and lets you subscribe to artists & automatically ~~pirate~~ obtain their songs via `yt-dlp`. My current workflow involved finding a good song, downloading it on my laptop, and using `rsync` to transfer to my phone so this feels like a nice improvement. Everyone else I know just pays for Spotify though.
