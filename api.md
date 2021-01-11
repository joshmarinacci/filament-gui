

# Numbers

Numbers are stored as integers or ratios (numerator and denominator) when possible, using
an internal BigNumber library. This allows it to perserve fractions when possible.

* __rand__: random numbers. `()->[0,1], (max)->[0,max], (min,max)->[min,max]`
* __sin__, __cos__, __tan__: the usual trig functions, in radians or degrees.
* __add__, __mul__, etc.  function implementations of the standard math operations.
* __pow__, power. 5^2 = pow(5,2)
* __sqrt__, square root
* __max__, __min__, max and min of the arguments. Works with scalars and lists.
* __random_integer(max)__: returns a random number between 0 and the max
* __randomreal__ or __randomfloat__?
* __is_prime__ return true if number is prime
* still needed: absolute value, round, floor and ceiling, natural log, log base 10, more trig functions





# Lists

* __range__: generate a list of numbers: `(max), (min,max), (min,max,step)`
* __map__:  convert every element in a list using a lambda function: `(list, lam)`
* __for__:  loops over every element in a list with a lambda, but returns the original list: `(list, lam)`
* __sort__: sort list returning a new list, by: property to use for sorting `sort(data by:"date")` (should we use `order` instead?)
* __take__: take the first N elements from a list to make a new list `take([1,2,3], 2) = [1,2]`
* __drop__: return list with the number of elements removed from the start. `drop([1,2,3],1) = [2,3]`
* __pick__: take random elements from list `pick(data,5)` get five random elements
* __reverse__: return a list with the order reversed  `reverse(data)`
* __select__: select items from list using where: lambda function returning false. `select(data, where=(t)=>t.amount>0)`
* __join__: concatentate two lists, returning a new list. is this needed?
* __length__: returns the length of the list
* __sum__: adds all data points together

# charts

* __plot__: lot a list of numbers as a scatter plot. x is the index in the list. y is the value of each number. can also plot equations as lambdas.
  * __type__: [point | line | number]
    * point: draw each datum as a point
    * line: draw lines connecting all of the points
    * number: draw points on a number line
* __chart__:
  * __type__: [bar, pie, stacked?]
  
* __histogram__: draws a histogram of the data 

# Strings

Unlike in the Wolfram language, you don't need separate functions for strings. They will act as lists of characters so `take`, `length`, `join`, etc will work just fine.

* __string__, make a string literal. same as doing `"some words here"`. Maybe it should be __text__ instead?
* __length__: works on strings too
* __to_upper_case__, __to_lower_case__, __capitalize__ transform between cases. returns new strings.
* __characters__: splits into a list of single char strings


# Graphics

Standard 2D graphics using the PDF / Canvas / SVG imaging model. Lengths and points may be specified with
units, like `rect(width=2cm, height=1ft)`. If no units are supplied then it is assumed to be pixels.

* __point__: a two component vector `point(25,50) === [25,50]`
* anywhere an xy pair can be used, a point can be used as well.
* __draw__: draws lists/nested lists of shapes
* __circle__ : a circle shape with center, radius, and fill
* __rect__: a rect shape with width, height, position and fill `rect(width=100, height=50)` 
* __regular_polygon__: an N-gon. ex: regular_polygon(5) = pentagon. accepts fill and center position.
* __pack_row__: packs shapes in a row, centered vertically
* __pack_col__: packs shapes in a column, centered horizontally. works on shapes, scalars and other elements.
* __pack_grid__: packs shapes in grid of the specified size.
* __draw_geomap__: draws a geo map
* __address_to_geo__: converts a street address to a geo coordinate (US addresses only)
* __color__: make a color. accept strings, hex RGB triplets, and keywords for red,green,blue, hue,saturation,value, or hue, saturation, lightness. supports abbreviations too. and all CSS named strings. Maybe split into RGB and HSV color functions?
*  __line_path__: a polyline, may or may not be closed. may or may not be filled. only lines (no curves). specify a list of xy pairs as points.
* __curve_path__: a path made of bezier curves


# Images

* __CameraImage__: takes an image from the camera, if available. 
* __Image__: get an image from a url
* ColorNegate: invert the colors in the RGB colorspace
* grayscale: convert to grayscale using RGB colorspace and standard grayscale conversion function
* Blur make a blurred version of the image. optionally give box size
* histogram: make a histogram of the colors in the image
* posterize: reduce the number of colors in the image
* edge detect: sokal edge detection kernel
* blend: combine two images using standard blend modes



# Dates and Time

For the most part dates and time are just scalars with units. You can create a datetime, do
simple arithmetic with it, and convert between timezones.  There are three types: Dates, Times,
and DateTimes.

* __Now__: DateTime representing right now.
* __Today__, __Tomorrow__, __Yesterday__: dates representing these days.
* __Date__: create a new date from a string. optionally specify a format
* __Time__: create a new time from a string. optionally specify a format.
* __DateTime__: create a new date-time from a string. optionally specify a format.

Maybe

* DayName, DayRange, MoonPhase, Sunset, Sunrise, LocalTime, AirTempperatureData,



# sound

Deferring for now.

# Tables or lists of lists or multi-dimensional arrays

I need to do more work on this. Follow APL's lead here about shape and rank. examples:
* make a times table from 1 to 12
* make a 16x16 grayscale image from random numbers
* the same with random colors instead of grayscale

# GeoData

Calculate geographical locations and draw maps. The basics are easy but this requires
more thought about how this would actually be used, and where the map data comes from. Could we
actually do something like show the 30 nearest volcanos?

* GeoPositon: a lat lon
* GeoMap:  draws list of GeoPositions on a map. automatically scales to show all 
* GeoDistance: distance between two positions using great circle math
* GeoPath, circle paths between lat lons, draw on the map.
* GeoCircle: radius around a geo point.
* GeoHere: attempts to detect your current location.
* GeoNearest: find points of interest nearest to a location? This needs a lot more thought.



# Constants

* Pi
* GoldenRation
* e

# data access

* Wikipedia()  returns wikipediat article as text (what kind of text? HTML? markdown? JSON?)
* Dictionary() returns definition of word as text or json or other?
* Weather() returns current and historical weather for a location
* Silly(") datasets from silly.io, including:
   * US states w/ dates, flags, abbreviations, capital cities, etc. lat/lon center, border,
   * Countries of the world including: english name, local name, population, ISO code, primary language, flags, etc.
   * planets and moons in the solar system including: mass, radius, orbital period, rotational period, albedo, photos, and more.
   * cities: major US cities
   * buildings: tallest buildings in the world
   * 




# Questionable

* __IntegerDigits__: split number into list of single digits.  `IntegerDigits(4200)` = `[4,2,0,0]`
* __count__: number of times element appears in the list. `count(list,'foo')`. Is this useful?`
* __first__, __last__: return the first or last elements of the list. can't we use `take(data,n)`.
* __rest__ return the list minus the first element
* __part__: wolfram uses part for array element selection. is this easier than `data[n]` indexing?
* __ColorNegate__ wolfram uses this to find a complientary color, but I think it's only using the hue.
* wolfram: __Blend__ mixes colors. Couldn't we do it with math?
* wolfram: __RandomColor__ vs making colors with random values in the constructor
* wolfram: __Style__ to style the output with colors and font sizes. Not clear what the 'output' is in these cases, since it could be anything. Really it's styling the output panel in the interface. I'm unsure about this.
* wolfram: filled versions of shapes, like `Disc` vs `Circle`.
* 3d graphics like sphere, cone, cylinder, and 3d plots.
* ImageCollage: group multiple images together. I feel like there must be a better way to do this.
* DominantColors: to return list of dominant colors in the image. It feels like this should be part of generating a full color histogram.
* __TextWords__ returns list the english words in the string. ignores punctuation.
* __TextSentences__ returns list of sentences in the string.
* WordCloud. I've never needed to use one of these.
* RomanNumeral: convert number to roman numerals. why?
* IntegerName, the number as english text. 42 = 'forty-two'. why?
* Alphabet: list of every letter. *maybe useful?*
* LetterNumber, index in the alphabet of the letter.
* FromLetterNumber, alphabet number to letter
* WordFrequency calculations
* Rasterize: turns text into an image using a particular style (font, size, color?)
* Rotate: to rotate graphics. I need to think more about how this will work.
* AnglePath: a way to do LOGO style turtle graphics.
* currency conversion. Do people really care about this without having a date context?
* Graphs. I'm not sure working with directed and undirected and weighted graphs is needed right now.
* Machine Learning: definitely not ready for this yet.
* how to do complex numbers?
* polar plotting?
* apply functions repeatedly through iteration and recursion as Wolfram does. Good for fractals?


