# Introduction to HL, a Humanist Language

HL (name TBD) is a [humanist](https://en.wikipedia.org/wiki/Humanism) programming language and IDE.  Think of it as a mixture of **Mathematica, Scratch, and open datasets, swirled together into modern UX**.


HL is meant to be accessible to all ages and levels of skill, from children to novice programmers to artists and even professionals who are doing exploratory programming. The syntax is designed to be simple to understand and forgiving of errors.  

Though HL uses some advanced computational concepts from existing [array](https://en.wikipedia.org/wiki/Array_programming), [functional](https://en.wikipedia.org/wiki/Functional_programming), and [object oriented](https://en.wikipedia.org/wiki/Object-oriented_programming) programming languages, these concepts are presented in a form that is simple as possible while still being useful.

HL can be used by itself, but is generally meant to be used within [a notebook interface](https://en.wikipedia.org/wiki/Notebook_interface), typically on the web. 



# Notable features

* All math operations are really functions and can be applied to scalars, lists, and larger objects.  ex:   `4 * [1,2,3] = mulitply(4,List(1,2,3)) = [4,8,12]`

* Identifiers and numbers are case insensitive and can have _'s anywhere in them without changing the meaning. ex: `is_prime` is the same as `IsPrime` and  `4_000_000` is the same as `4000000`

* All numbers have optional units and can perform unit arithmetic and conversions. ex: *How fast can Superman fly around the world?*

```javascript
earth.radius * 2 * π / 4000ft/s as hours = 9.11 hours
```

* Reactive like a spreadsheet. When a function or variable is re-evaluated to return a new result, any dependent expressions are automatically re-evaluated as well. 

* Variable assignment and function application are flexible so that the code can be shaped depending on needs of the problem. Ex: *draw 10 circles with random radiuses lined up horizontally*. 

Rather than nesting a series of functions
```javascript
draw(row(map(random(10),(r)=>circle(radius:r))))
```

they can be pipelined with the `>>` operator

```javascript
random(10) 
  >> map(r=>circle(radius:r)) 
  >> row() 
  >> draw()
```

making them easier to understand.

To set a variable either `<< `or `>>` can be used. This emphaszes that data is moving *into* the variables and then used later. Same example as above, with intermediate variables.

```javascript
nums << random(10)
nums >> map(radius => circle(radius)) >> circles
circles >> row() >> draw()
```

* Multiple syntaxes.  The underlying AST can be represented in one of three ways: a **pure ASCII version** (as in examples above), a **print ready** version that uses unicode glyphs where appropriate but would be harder to type without editor support (`pi` = `π`, `theta` = `ø`,  `<< and >>` = arrow symbols, etc.), and finally a **visual block syntax** similar to [Scratch](https://en.wikipedia.org/wiki/Scratch_(programming_language)) (appropriate for younger programmers who are just getting started).  All three syntaxes are fully interchangable. 

* Keywords and operators are very opinionated, and chosen to be understandable by non-programmers. The boolean operators are `and`, `or`, and `not` rather than `&&`, `||`, and `!`, though these may optionally be available for advanced users if they want. The same with `<< >>` used for assignment and pipelines rather than bit shifting.  Many of the more confusing C derived standard operators have been removed, like `++` and `+=`.

* Humanist APIs. The environment comes with a series of APIs designed to be consistent and easy to combine. They work together in a holistic way that feels natural. For example: the graph label function can take text, numbers, colors, images, or urls.  Functions generally do the best they can with whatever you give them, and complain visually when they have problems so you can easily fix it. Check out some of the [APIs](./api.md)

* Built in Datasets. The environment and language are designed to easily access local and remote datasets to do interesting computations. Further more it will come with built in datasets of known facts, such as countries of the world, planets in the solar system, scrabble word scores, and more.




HL takes inspiration from

* [Frink](https://frinklang.org/)
* [APL, J, Kerf](https://github.com/kevinlawler/kerf)
* [Jupyter & and Python](https://jupyter.org) and notebook programming
* [Mathematica](https://www.wolfram.com/mathematica/)
* [TallyCat](http://apps.josh.earth/tallycat/), an earlier unit based calculator I wrote.



More info:

* [Tutorial](./tutorial.md)
* [API](./api.md)
* [prototype](http://apps.josh.earth/tallycat/) implementing just the unit arithmetic.

