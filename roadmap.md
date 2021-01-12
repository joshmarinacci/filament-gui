# Roadmap




https://writings.stephenwolfram.com/2016/09/how-to-teach-computational-thinking/

# research

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

