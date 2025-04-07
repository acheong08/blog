+++
title = "Can you boost gaming performance by disabling hardware vulnerability mitigations?"
+++

[How to disable mitigations (Linux)](https://unix.stackexchange.com/questions/554908/disable-spectre-and-meltdown-mitigations)

Note: The path of the bootloader config may depend on the distribution. For Arch Linux, it should reside in `/boot/loader/entries/`. You can add `mitigations=off` to the end of the `options` line.

Disabling these mitigations only help with CPU bottlenecks which is exceedingly rare if you have any decent laptop or PC from the last 10 years. I got a ~6% boost in benchmarks but FPS wise, the GPU will almost always be the limitation. You can use [MangoHud](https://github.com/flightlessmango/MangoHud) to check what the bottleneck is.
