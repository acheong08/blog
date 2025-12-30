+++
title = "Failing a Java interview by NOT CONFIGURING NEOVIM CORRECTLY"
+++

So I'm not really a Java programmer, but I can write Java since all university coursework pretty much mandates it. But since I haven't written it in a while, I didn't properly set it up when I rewrote [my Neovim config](https://github.com/acheong08/nvim).

> Q: Why are you applying to a Java position if you're not a Java programmer?
>
> A: Those are the only jobs around...

Before the interview, I set up `nvim-java` as usual and tested that it worked with a simple Java file, not thinking much of it. Definitions, errors, formatting, all working.

Then, during the interview, I decided it was probably a good idea to set up a proper gradle project with testing and whatnot. But then everything fell apart. `jdtls` gave me the most random errors such as `1. String cannot be resolved to a type [16777218]` and `1. System cannot be resolved [570425394]`.

I didn't know how much time it'd take to solve the issue, and obviously spending the entire interview debugging a neovim config was a bad idea. The interviewer was already annoyed at that point: "You know when you start working a real job, you'd need a real IDE.". I had already uninstalled IntelliJ a couple months back after my last Java coursework, and for such a large package, it was gonna take forever to download.

So VSCode it was.

However, the combination of Java, VSCode, and Google Meet caused my CPU to run at 100% and crashed my laptop. For the entire rest of the interview, I was thermal throttled with a couple seconds latency between a key press and text showing up on screen. I ultimately ran out of time by ~5 seconds which infuriates me since that is significantly less than the time wasted by performance issues.

After the interview, I solved the problem in barely 5 minutes. Shorter than the amount of time it took to recover from all the crashes.

The reason appears to be that `nvim-java` defaults to Java 17 found at `~/.local/share/nvim/nvim-java/packages/openjdk/17/` while Gradle was using Java 25. Some weird combination of the configuration made the JDK fail to load.

The solution here was really simple:

```lua
vim.lsp.config("jdtls", {
  settings = {
    java = {
      configuration = {
        runtimes = {
          {
            name = "JavaSE-25",
            path = "$HOME/.sdkman/candidates/java/current",
            default = true,
          },
        },
      },
    },
  },
})
```

The correct solution might actually be to just get a better laptop, but unfortunately I'm broke. So Neovim it is.
