+++
title = "A Case for Golang"
+++

> **Note:** This post is directed towards a very specific group: Beginner Python programmers I'm about to be working with.

Programming languages are an odd tribal thing. I understand the resistance to learning anything new, especially when throughout academia, Python has been touted as the simplest, easiest language. I shall argue that it is simply not the case, and that its classic "simple" features actually make collaboration and long-term maintenance _more_ difficult.

I am not pulling arguments out of my arse. In fact, Python was my primary language from 2018-2023, and I do still write my quick scripts in it. I have written open source projects in Python with over a hundred contributors and millions of downloads. On the other hand, I'm also not very smart. Tell me to debug an issue with lifetimes in Rust and I will struggle. My goal is to convince you to choose something easier, not more difficult.

## What's even different between languages?

I'd say languages within the same category (Object oriented, functional, procedural, etc.) are generally very similar. In fact, Typescript and Golang are so similar that Microsoft was able to automatically translate the whole Typescript compiler into syntactically Golang [1].

```typescript
// TypeScript
function fizzbuzz(n: number): void {
  for (let i = 1; i <= n; i++) {
    let output = "";
    if (i % 3 === 0) {
      output += "Fizz";
    }
    if (i % 5 === 0) {
      output += "Buzz";
    }
    console.log(output || i);
  }
}

fizzbuzz(15);
```

```go
// Go
package main

import "fmt"

func fizzbuzz(n int) {
  for i := 1; i <= n; i++ {
    output := ""
    if i%3 == 0 {
      output += "Fizz"
    }
    if i%5 == 0 {
      output += "Buzz"
    }
    if output == "" {
      fmt.Println(i)
    } else {
      fmt.Println(output)
    }
  }
}

func main() {
  fizzbuzz(15)
}
```

```python
# Python
def fizzbuzz(n):
    for i in range(1, n + 1):
        output = ""
        if i % 3 == 0:
            output += "Fizz"
        if i % 5 == 0:
            output += "Buzz"
        print(output or i)

if __name__ == "__main__":
    fizzbuzz(15)
```

Once you are able to abstract the concepts of branches, functions, classes, etc, it is not difficult to pick up another language at the beginner's level.

The main difference you usually find is the keywords, available/standard libraries, and more advanced features such as decorators or async. I assume for a 3rd year Software student in a place as run down as Cardiff, advanced features are rarely used, meaning that there is no major paradigm shift required to learn something new.

My point here is that you shouldn't be afraid yet.

## Simplicity and Complexity

Complexity tends to be more a feeling than a measure. However, a common symptom is surprising code, where it does something you don't expect and don't understand why or how, leading to the worst debugging experiences.

```python
from typing import Any

class Meta(type):
    def __new__(
        mcs: type["Meta"],
        name: str,
        bases: tuple[type, ...],
        namespace: dict[str, Any],
    ) -> "Meta":
        namespace["generated_attr"] = "created by metaclass"
        return super().__new__(mcs, name, bases, namespace)

class MyClass(metaclass=Meta):
    pass


print(MyClass.generated_attr)  # "created by metaclass"
```

Many of these complex features will never be written by the average developer, but instead be found deeply nested in a transitive dependency. Instead, this is simply not possible in Go. Other developers do not get to write code you don't understand syntactically. Once you learn the basics, you have learnt most of the entire language.

## Static typing

For previous projects, our teams have pretty much agreed to make all of our Python code type hinted. I don't think I need to argue much about why this is preferred: catching bugs at compile time, easier collaboration since we can understand functionality from function signatures rather than reading internals, and improved LSP/editor experience with auto complete.

The problem comes mainly from libraries. Even in 2025, many major libraries in Python are still completely missing or have incomplete type hints with `Any`'s sprinkled around all over the place. It is overall just not a very pleasant experience when building a large project that requires these dependencies.

## Libraries and ecosystem

One huge selling point for Go is its massive standard library. For the majority of tasks, you rarely have to go out and depend on a random barely maintained package that risk turning into malware. We have seen the supply chain attacks like `xz-utils` and the NPM worm. In fact, our current project is being built specifically to protect against these threats. Why then, would we specifically choose an ecosystem that forces the use of many unnecessary and possibly insecure libraries? Given that we're mostly writing API services, we will need to do a fair bit of serialization from/into JSON/classes, which surprisingly Python does not natively support. This also ties back to how Python has too much magic, including those that mess with an object's properties, hence why serialization tends to include a lot of automatically generated properties.

## Version compatibility and breakage

Golang has compatibility built into its specification [2]. And with no breaking changes, decades old code can be easily reused without churn. Meanwhile, Python has numerous breaking changes in point releases alone [3]. It should be self evident why you want your code to continue working. Especially for a startup, it can be expensive or even economically impossible to update to a new Python version. This doesn't even take into account dependency incompatibilities due to versioning.

## References

1. https://github.com/microsoft/typescript-go/discussions/467
2. https://go.dev/doc/go1compat
3. https://www.nicholashairs.com/posts/major-changes-between-python-versions/
