

# Numbers

* __rand__: random numbers. `()->[0,1], (max)->[0,max], (min,max)->[min,max]`
* __sin__, __cos__, __tan__: the usual trig functions, in radians or degrees.


# Lists

* __range__: generate a list of numbers: `(max), (min,max), (min,max,step)`
* __map__:  convert every element in a list using a lambda function: `(list, lam)`
* __for__:  loops over every element in a list with a lambda, but returns the original list: `(list, lam)`
* __order__: sort list returning a new list, by: property to use for sorting `sort(data by:"date")`
* __take__: take the first N elements from a list to make a new list `take(data, 10)`
* __pick__: take random elements from list `pick(data,5)` get five random elements
* __reverse__: return a list with the order reversed  `reverse(data)`
* __select__: select items from list using where: lambda function returning false. `select(data, where=(t)=>t.amount>0)`


# Graphics

* __point__: a two component vector `point(25,50) === [25,50]`
* __draw__: draws lists/nested lists of shapes
* __circle__ : a circle shape with center, radius, and fill
* __rect__: a rect shape with width, height, position and fill `rect(width=100, height=50)`
* __pack_row__: packs shapes in a row, centered vertically
* __pack_col__: packs shapes in a column, centered horizontally
* __draw_geomap__: draws a geo map
* __histogram__: draws a histogram of the data 
* __address_to_geo__: converts a street address to a geo coordinate (US addresses only)
