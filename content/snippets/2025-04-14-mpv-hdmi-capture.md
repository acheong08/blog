+++
title = "Using a laptop as a second monitor (Linux)"
+++

So first thing you need is an HDMI capture card. I got myself a cheap one for £5 on Amazon.

One thing you'll notice when simply using `mpv /dev/video4` is that it defaults to `yuyv422` at 5fps. The same happens in OBS and VLC. Using the command from the Arch wiki `mpv --demuxer-lavf-format=video4linux2 --demuxer-lavf-o-set=input_format=mjpeg av://v4l2:/dev/video4` gets you much better fps at the cost of high latency (Up to 1000ms).

```
mpv --demuxer-lavf-format=video4linux2 --demuxer-lavf-o-set=input_format=mjpeg --profile=low-latency --untimed av://v4l2:/dev/video4
```

This gets me much better latency (50ms) with lower resolution but still very usable for watching videos and reading text.
To improve resolution, I lowered the FPS to 30 in Hyprland

```
monitor=HDMI-A-1,1920x1080@30.00Hz,auto-right,1.5
```
