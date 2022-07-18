# Filament: A Humanist Language

Filament is a humanist programming language for doing exploratory research 
and visualizations.  Filament is reactive and organized around transforming and plotting data. 
It is a humanist language, because its primary 
concern is providing a good experience for the human doing the programming. It does *not* focus on 
performance or type safety, except where that would help the primary humanist concerns.
*Filament is a tool for thinking about things, not shipping production software.*

See the [intro](./intro.md) document for more on the philosophy and what makes Filament unique.

# Examples:

## Histogram of date states entered the union

```javascript
    DATASETS.US_STATES >>
        histogram( item: (s)=>state.date_entered_union,
                  label: (s)=>state.abbreviation,
                  bin_size: 10yrs)
```


## How long would it take Superman to fly around the world
Let's assume he is [faster than a speeding bullet](https://en.wikipedia.org/wiki/.220_Swift). 
We need the circumference of the earth and the speed of the fastest bullet. Lets show it in hours.

```javascript
earth.circumference / 4_000 ft/s as hours
````

## Show the relative sizes of the planets in the solar system as a row of circles
```javascript
planet_to_circle << (planet) => circle(
    radius = planet.radius,
    fill = color(hue=random(360))
    )

DATASETS.PLANETS >> map(planet_to_circle) >> row() >> draw()
```


## How many milliseconds is 15 minutes

```javascript
  15 minutes as msec
```


  

## Plot all of my friends on a map by their addresses as user avatars

```javascript
select(contacts, where: (a) => a.type == DB.person and a.category == DB.contacts)
  >> for((f) => f.latlon = lookup_lat_lon(f.address))
  >> draw_geomap( coord: (f)=> f.latlon, label: (f)=>f.avatar)
```

The `draw_map` function takes a list of objects. If the objects are themselves lat/lon pairs 
it will just draw them with default markers. If the objects are not GeoCoordinates 
it will need an accessor function to pull out the lat lon. You can also use a mapping 
function to pull out a label.

## Show the current position of the ISS on a map

```javascript
import ISS
find_position(now()) >> draw_geomap( globe:true)
```


## Draw the relative height of a 6ft man and 40in child

```javascript
  rect(width:1ft height:6ft) >> man
  rect(width:1ft height:40in) >> child
  row([man,child]) >> draw()
```

## Draw the relative thinness of every iphone

```javascript
iphones = datasets('iphones')
iphones 
  >> map( p => rect(width:p.depth, height:p.height))
  >> for( r => r.fill = color({hue:randi(360)}))
  >> row()
  >> draw() 
```

## Plot the equation x^2 + 5x
```javascript
fun eq = (x) => x^2 + 5x
plot(eq, range:[0,10])
```

## 10 tallest buildings in the world as table and diagram

```javascript
order(DATASETS.BUILDINGS, by:'height', dir:'asc') >> take(10) >> buildings
show(buildings)
buildings >> map(h => rect(height:h, width: h/10)) >> row() >> draw()
```

## Chart atomic number vs year of discovery

```javascript
elements = datasets('elements')
chart(elements, 
  x_axis:(e)=>e.number, 
  y_axis:(e)=>e.discovery_date, 
  type:'scatter')
```

## Calculate scrabble value of the word EXIT

```javascript
let word = 'EXIT'
let letters = dataset('alphabet')
word.map(l => letters[letter].score) => sum()
```

## Vector math for drawing points

```javascript
// define some points
let A = [25,50]   // first point
let B = [100,50]  // second point

let AB = B-A   // subtract vectors to get the part between the two points
fun magnitude (A) => (A[0]**2+A[1]**2)**-2 
fun normalize (A) => (A/magnitude(A))
fun make_rot (Ø) => [ [cos(Ø), -sin(Ø)], 
                      [sin(Ø),  cos(Ø)] ]

fun dot (A,B) => + across (A*B)

fun cross (A,B) =>  [
    A[1]*B[2] - A[2]*B[1], 
    A[2]*B[0] - A[0]*B[2],
    A[0]*B[1] - A[1]*B[0],
]
fun angle (A,B) => arccos(dot(A,B)/(mag(A)*mag(B)))
// rotate by 90 degrees
let rotated = make_rot(PI/2) * AB
```

# Random stuff

## image manipulation

`coord` here is a vector of 2 numbers, (x,y)
`color` here is a vector of 3 numbers, rgb, 0->1.

```javascript
// mix each pixel w/ adjacent 50%/50
for(image, (coord, color) => {
    let adj = getPixel(image,coord+[1,0])
    return (color + adj)/2
})
```


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
range(100) >> select(where= x=>x*x>3, map:x=>x*2)
```
or
```javascript
range(100) >> filter(x=>x*x>3) => map(x=>x*2) => show()
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

https://writings.stephenwolfram.com/2016/09/how-to-teach-computational-thinking/
