# A Humanist Language

HL (final name TBD) is a humanist programming language for doing exploratory programming 
and visualizations.  It is reactive and organized around transforming and plotting of data. 
It is a humanist language, as its primary 
concern is providing a good experience for the human doing the programming. It does not focus on 
performance or typesafety, except where that would help the primary humanist concerns.
*Notebook Lang is a tool for thinking about things, not shipping production software.*


See the [intro](./intro.md) document for more on the philosophy and what makes it unique.

Read the [Tutorial](./tutorial.md) to get a feel for what it would be like to use.

The [Language Spec](./spec.md) and built-in [APIs](.api.md) 

[Examples](./examples.md) plus more examples below

The (very rough) [Roadmap](./roadmap.md)


Note: __This language is currently theoretical (with implementation stubs), but the eventual goal is a web-based notebook interface that anyone can use and share.__


# Examples:

## Histogram of date states entered the union

``` javascript
    DATASETS.US_STATES =>
        histogram( item: (s)=>state.date_entered_union,
                  label: (s)=>state.abbreviation,
                  bin_size: 10yrs)
```


## How long would it take Superman to fly around the world
Let's assume he is [faster than a speeding bullet](https://en.wikipedia.org/wiki/.220_Swift). 
We need the circumference of the earth and the speed of the fastest bullet. Lets show it in hours.

`earth.circumference / 4_000 ft/s as hours`


## Show the relative sizes of the planets in the solar system as a row of circles
``` javascript
planet_to_circle <= (planet) => circle(
    radius = planet.radius,
    fill = color(hue=random(360))
    )

DATASETS.PLANETS
  => map(planet_to_circle)
  => pack_row()
  => draw()
```


## How many milliseconds is 15 minutes

``` javascript
  15 minutes as msec
```


  

## Plot all of my friends on a map by their addresses as user avatars
If we assume friends only have one mailing address

``` javascript
find(contacts, (a) => a.type == DB.person and a.category == DB.contacts)
  => for((f) => f.latlon = lookup_lat_lon(f.address))
  => draw_geomap( coord: (f)=> f.latlon, label: (f)=>f.avatar)
```

The `draw_map` function takes a list of objects. If the objects are themselves lat/lon pairs 
it will just draw them with default markers. If the objects are not GeoCoordinates 
it will need an accessor function to pull out the lat lon. You can also use a mapping 
function to pull out a label.

## Show the current position of the ISS on a map

```javascript
import ISS
find_position(now()) => draw_geomap( globe:true)
```


## Draw the relative height of a 6ft man and 40in child

``` javascript
  rect(width:1ft height:6ft) => man
  rect(width:1ft height:40in) => child
  pack_row([man,child]) => draw()
```

## Draw the relative thinness of every iphone

``` javascript
iphones = DATASETS.IPHONES
iphones 
  => map( p => rect(width:p.depth, height:p.height))
  => for( r => r.fill = color({hue:randi(360)}))
  => pack_row()
  => draw() 
```

## Plot the equation x^2 + 5x
``` javascript
fun eq = (x) => x^2 + 5x
plot(eq, range:[0,10])
```

## 10 tallest buildings in the world as table and diagram

``` javascript
order(DATASETS.BUILDINGS, by:'height', dir:'asc') => take(10) => buildings
show(buildings)
buildings => map(h => rect(height:h, width: h/10)) => pack_row() => draw()
```

## Chart atomic number vs year of discovery

``` javascript
let elements = DATASETS.ELEMENTS
chart(elements, 
  x_axis:(e)=>e.number, 
  y_axis:(e)=>e.discovery_date, 
  type:'scatter')
```

## Calculate scrabble value of the word EXIT

``` javascript
let word = 'EXIT'
let letters = DATASETS.SCRABBLE
word.map(l => letters[letter].score) => sum()
```

## Vector math for drawing points

``` javascript
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
