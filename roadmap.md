# Roadmap

* fully post blogs about the development. at least once a week.

## M1
- [x] focus on impl instead of research
- [x] Remove custom types. Just use regular JS syntax where possible. plain JS objects.
- [x] headless unit test support. make `npm run lang-tests` work
- [x] impl all math functions with unit tests
- [x] impl all list functions with unit tests
- [x] implement API enough for 10 examples to work
- [x] blog post on the language and some ascii code examples


## M2
- [x] render tables and lists as spreadsheet like view
- [x] add 10 new examples to sidebar
- [x] blog post on the editor
- [ ] implement parser enough for all examples to work that don't use lambdas
- [ ] Scalar() class with unit. 
- [ ] List() class from list literals or datasets or other. Works with records too.
- [ ] Callsite class represents a parsed function with args ready to apply
- [ ] all functions work with new list and scalar classes
- [x] pipeline works to compose functions
- [ ] spec named vs indexed arguments
- [ ] implement named and indexed args for a few functions
- [ ] switch editor to use HL language
- [x] implement the current syntax in an ohm parser
- [ ] implement 10 examples using new syntax

## M3
- [ ] button to add new code block
- [ ] button to add new markdown block
- [ ] render code and markdown pretty when not editing them
- [x] review: https://cuelang.org
- [ ] research syntaxes for code blocks, lambdas, and control flow in non-C style languages. 
    smalltalk, applescript, hypertalk, dylan?
- [ ] design better syntax for control flow, code blocks, named and lambda functions
- [ ] blog post

## M4
- [ ] design & impl full shape drawing system
- [ ] design chart system to auto-detect formats and labels. lets you customize as needed for all current examples
- [ ] scatter chart
- [x] bar chart
- [ ] pie chart
- [ ] circles and rects drawing
- [ ] polygon and path drawing
- [ ] turtle drawing
- [ ] add 10 new examples which use graphics
- [ ] blog post

## M5
* blog post
* add unicode pretty view
* prototype visual scratch blocks view of same code. split pane. not interactive.

## to be categorized

* load and save to localstorage
* list of existing notebooks to load
* load and save to docserver using github auth
* splash page explaining what it is and w/ tutorial
* custom domain
* access remote datasets from the web
* access remote datasets from silly.io with schema to guide how it's interpreted
* twitter api
* stock api
* weather api
* dictionary api
* more of the tutorial written


* brainstorm 10 new examples
    * website analytics. think about what i want to capture
        * for each week, how many total, how many per route, top ten user agents per route, top ten langs per route, top ten countries per route. same top ten for the totals. 
        * show the same for each day for the past 7 days
    * simple raytracer
        * draw three spheres, no reflections, two lights.
    * mandlebrot renderer
        * draw mandel given an input range and output resolution
    * lindenmayer system tree
        * draw a simple tree by mapping letters to functions. R R F, etc.
    * logo impl for turtle graphics
        * needs logo gfx output surface
        * draw 4 classic logo programs using equivalent syntax
        * draw them with abbreviated syntax R F R L U D, etc.
    * recreate some circles demos from wolfram tutorial
        * nested circles offset
        * circles w/ different colors
    * get 10 recent tweets on a hashtag into a list, include username and text and timestamp
        * most recent tweets on #magic hashtag. re-evaluate to get new data. includes text, username, and timestap in a table.
    * whats 99 to the 99th power
    * how much is 20 thousand leagues
    * how many teaspoons in a gallon
    * koch triangle using logo rules using a rule map. needs matching/mapping and gfx.
    * plot element number vs discovery date. needs built in elements data. 
        * chart detects number vs date
    * plot public stock history of apple over the last 12 months
        * chart automatically detects time vs stock price
    * timeline of states entering the union
        * chart detects index, uses name as label. special timeline chart.

# research and bibliography and open questions

https://writings.stephenwolfram.com/2016/09/how-to-teach-computational-thinking/

https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(list_comprehension)

Look at what LINQ does.

```csharp
var ns = from x in Enumerable.Range(0, 100)
         where x * x > 3
         select x * 2;
```

is sugar for

```csharp
var ns = Enumerable.Range(0, 100)
        .Where(x => x * x > 3)
        .Select(x => x * 2);
```

how about 
```javascript
range(100) => select(where= x=>x*x>3, map:x=>x*2)
```
or
```javascript
range(100) => filter(x=>x*x>3) => map(x=>x*2) => show()
```


turned into block language
```
|--------------|
| make 0 to 10 | 
|--------------------|
| include x where    |
|  x*x > 3           |
|--------------------|
| transform x to |
|  x * 2         |
|----------------|
```


# Philosophy

* build your code up in pieces, incrementally. always be able to see the steps along the way
* learn as you code. shortcuts are just sugar for plain stuff. learn the plain then learn the sugar
* make a separate function, then inline it.

# Questions

* How can you show provenance? Include textual descriptions with links. Ex: [The 5 Fastest Rifle Cartridges](https://www.msn.com/en-us/news/us/the-5-fastest-rifle-cartridges/ar-BB17nLBQ)
* How to auto-complete the `earth.circumference` part?
* How to make sure the unit `ft/s` isn’t interpreted as actual division?

* define clamp to work on more than just scalars. could you clamp a color vector or a point vector?
* visualize vectors by drawing as arrows. how?  map list of vectors to arrows?
* how to let you work with components of vectors with xyz rgb etc when it's really just a list of two numbers underneath

[Eucliean Vector](https://en.wikipedia.org/wiki/Euclidean_vector)


* What's the shortest possible raytracer using vector math. 
    * Loop over every pixel
    * generate primary ray
    * intersect with list of objects
    * find normal at closest intersection
    * calculate shading using lights.
    * project secondary rays and recurse

  
* what's a good syntax for anonymous functions / lambdas?

``` javascript
double = @(x) x*2
double = |x|x*2|
double = (x)=>x*2
double = x => x*2
double = lambda x: x*2
double = {x:Number -> x*2}
double(x) = x+y
```


* equality vs setting variables and pipeline.  Can pipelining to a new identifier be the same as setting a variable? ex:

``` javascript
// set the foo variable to the 'bar' string
var foo = 'bar'  //assign foo
var foo := 'bar' //assign foo
'bar' => foo     //assign to foo
(foo=='bar')     //comparison

```



# Possible Business Models

There is no business model for a programming language. They are cost centers. They also tend to
get better adoption when they are open source; at least in the 21st century. I think Java was the
last non-open source language to gain wide adoption.  Making HL is going to be hard. Not the actual
implementation, but the platform and the marketing to drive adoption and work with potential users. 
Plus a lot of the value will come from system integration (twitter apis) and data curation (useful
datasets) All that takes money. Wolfram Alpha is expensive to make and maintain.
So what are the options.

* *desktop software* Make it be an app you download and install. Charge once and for upgrades, or a subscription.
* *Donations* from individuals to a the HL non-profit.
* *SaaS for the platform*. Make a hosted version with built in datasets and API integrations. Language and std lib are still open source, and anyone
could host their own impl, just without the integrations and datasets.
* *ads* just slap ads on it. A completly free and open resource with ads. [Like these](https://www.worldometers.info/geography/alphabetical-list-of-countries/)
* *sponsorship* it's a public resource and big companies pay to be the sponsor. Think NPR sponsorships. The sponsor name is tasteful and on every page, just once per page.
* *sell books* create programming books on it that are sold.
* *sell cirriculum* if this really is that powerful, sell a curriculum based on it to schools and home schoolers and clubs.


