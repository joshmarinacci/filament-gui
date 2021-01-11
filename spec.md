

# Operators

## Boolean Operators

* `<` less than
* `>` greater than
* `<=` less than or equal
* `>=` greater than or equal
* `=`  equal 
* `<>` boolean NOT equal
* `!=` boolean NOT equal?  What about unicode: `≠`

* `and` boolean AND
* `or`  boolean OR
* `not` boolean NOT

## Math Operators

* `+` add(a,b), addition
* `-` sub(a,b) subtraction
* `*` mul(a,b) multiplication
* `/` div(a,b) division
* `**` pow(a,b)  exponentiation
* `-` neg(a)  negative sign (depending on context)
* `!` fact(a) factorial
* `mod` mod(a) modular (*remainder*) division. `%` is used for percentages

## All the rest

`()` parenthesis for grouping and function calls
`[]` square brackets for list literals, maps to `list(a,b,c,...)` function
`<<` assign
`>>` assign and pipeline operator (depending on the context)
`as` convert to a specified unit. ex: `10cm as inches`. works on lists.


## specifically not included

* bitshifting `<<` `>>`
* bitwise booleans `|` `&`
* increment and decrement shortcuts:  `--` `-=` `+=` `++`
* symbols for boolean AND, OR, NOT, XOR
* ranges: `1..10`, `1..<10` and other comprehensions (may revisit)
* % for modular division. use `mod` instead
* curly braces `{}` are currently not used and are often harder to type on non English (QWERTY) keyboards.


# alternatives

pipeline: `|` `|>` `->`

anonymous function calls: `(x)=>(x*2)` or `(x)={x*2}`

apply operator over a list `@/` `//` or `over`.  ex:  `+ over [1,2,3]` to calculate the total.

* `-` or whitespace inside identifiers. Would this cause more trouble than it's worth?


# Unicode operators and identifiers

While any unicode characters can be used in strings and identifiers, 
these will likely have special support in the interface to make them easier
to enter. They will also be shown in their unicode form in the "print ready" syntax.

* theta `ø` or **&#952;**
* pi **π** or **∏**
* alpha **&#945;**
* sigma **&#963;** and **&#931;**
* not equal **&#8800;**, greater than or equal, and less than or equal
* right arrow **&#8594;** replaces >> 
* left arrow **&#8592;** replaces <<
* curved arrow **&#11148;** or **&#11181;** replaces return ??


# identifiers

Indentifiers can (currently) use
* alphanumeric `A-Za-z`
* digits `0-9`
* underscore `_`


Other special characters such as `~@#$^&;?` should not 
be used since they may be used in the future.

Whitespace is not significant, but is not allowed inside of indentifiers, since they
are used for tokenization.

# number syntax

Numbers are the same as in most programming languages
(integer, floating point, hex). Octal is not supported. 
Binary is not currently supported (may revisit).


* integer `-? [0-9]+`  ex: 42
* decimal `-? [0-9]+ . [0-9]*` ex: 42.42
* scientific notation `decimal e integer` ex: 42.42e42
* hex: `0x [0-9] [A-F] [a-f]` ex: 0xFFAAbb.  Maybe also use # to indicate hex?

Underscores may be placed
anywhere within numbers to help with readability. They will
be stripped before evaluation.

`42_000_000` is easier to read than `42000000`

Units are word suffixes. They may or may not be separated
from the number part by a single space. Separating by newlines
is not allowed.

# strings

Single, double, and back quotes are all allowed for creating text literals.
There is no distinct character type.  *smart quotes* or curly quotes
will be replaced with their standard equivalent.

# functions

Functions are named by standard identifiers. They are called
using parenthesis with one or more arguments. Arguments
by be referred to by position (indexed) or name (keyword). 


Consider the `chart` function.
```javascript
function chart(
    List data=required, 
    String type='point'?, 
    Color color='black'?) {

}
```

A call to `chart` must include the data parameter or it
throws an error. The other arguments are optional
(as indicated by the `?`). They have defaults to be used
if the parameter is missing.  The arguments may be
called by order or name. ex:

call by order
```javascript
chart( [1,2,3], 'point', 'red')
```
call by keyword
```javascript
chart( data=[1,2,3], color='red')
```
call by order and keyword
```javascript
chart( [1,2,3], color='red')
```



# control flow

For now control flow, function definitions, comments, code blocks, lambda functions,
conditionals, etc are TBD, so they will use the JS equivalents for now.

- No increment operators 
- document the ‘as’ operator. works over lists too.
- mention comments, blocks, conditionals, flow control are still TBD, so using JS for now
- mention function def and lambda syntax still TBD, so JS for now


* if, then, else
* switch / match
* code blocks
* return
* defining functions
* defining custom datatypes or classes







