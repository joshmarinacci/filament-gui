
# HL Tutorial

Welcome to HL, a humanist programming language.  Computers are amazing. They can calculate incredible things super fast. They can aswer questions and draw graphics. However, computers are actually very dumb. All they do is simple
arithmetic. But they can do it super duper fast.  To do smart things humans have to teach them.  This is called programming. Anyone can program, including you!



# Arithmetic

HL understands arithmetic. Try typing in a math quesiton like `2+2` then press the 'run' button (or type control-return on your keyboard). HL will show you the answer: `4`.  Now try dividing 4 by 2 or multiplying 3 by 5. Type in `4/2`. Run it. Then type `3 * 5`  HL uses `/` to mean division and `*` for multiplication.

HL understands longer math equations too. For example, imagine you have a refridgerator box that is 7 feet tall by 4 feet wide by 4 feet deep. You could find out the volume of the box by multiplying all of the sides.

```javascript 
7 * 4 * 4
```

which equals 112.

### Units

In the above problem only *we* know that the `7` meant `7 feet`. The computer doesn't know because we didn't tell it. Fortunately HL lets us tell the computer exactly what units we mean. Let's try that again. Type:

```javascript
7 feet * 4 feet * 4 feet
```

Now we get `112 cuft`.  Cool. HL knows to convert the answer into cubic feet.  But what if we didn't want cubic feet. We are talking about voume and there are several different units that could represent volume. Let's ask HL to convert it into gallons instead.

```javascript
7 ft * 4 ft * 4 ft as gal
```

which gives us the answer `837.81 gallons`. 

Notice that this time we abbreviated `feet` to `ft` and `gal` for `gallons`.   HL understands the full names and abbrevations for over a hundred kinds of units, and it can convert between any of them.  Here's a few more examples to try.  

convert your height into centimeters. I'm 5'4", so

```javascript
5 feet + 4 inches as cm 
```
is
```
162.55cm
```

Some kitchen math:

```javascript
2 cups + 4 tablespoons
```
is
```javascript
36 tablespoons
```

Calculate your age in seconds.

```javascript
now() - date("Jan 1st, 2003") as seconds
```

If you try to convert something that can't be converted, like area to volume, then HL will let you know. Try this

```javascript
7ft * 4ft as gal
```
results in
```
Error. Cannot convert ft^2 to gallons.
```

Units are very important. They help make sure our calculations are correct. Even professionals get this wrong some times. [NASA once lost a space probe worth over 100 million dollars](https://www.latimes.com/archives/la-xpm-1999-oct-01-mn-17288-story.html) because the software didn't convert correctly between imperial and metric units. 

### Superman

Now lets try a more complex problem. In one of the Superman movies he flies so fast that the world turns backwards and reverses time. That got me thinking. Is that realistic? The earth is pretty big. How long would it really take him to fly around the world?

We need some information first. How fast can Superman fly? Apparently the comics are pretty vague about his speed. Some say it's faster than light, some say it's infinite, some say it's just slighly slower than The Flash.  Since this is about the real world let's go with an older claim, that [Superman is faster than a speeding bullet](https://screenrant.com/superman-faster-speeding-bullet-confirmed/).  According to the internet, the fastest bullet ever made was was the [.220 Swift](https://en.wikipedia.org/wiki/.220_Swift) which can regularly exceed 4,000 feet per second. [The fastest recorded shot was at 4,665 ft/s](https://www.quora.com/Whats-the-fastest-bullet-in-the-world-What-makes-it-so-fast-How-are-they-made), so we'll go with that.

Now wee need to know how big the earth is. The earth isn't perfectly spherical and of course it would depend on exactly which part of the earth superman flew, but [according to Wikipedia](https://en.wikipedia.org/wiki/Earth) the 
average (mean) radius of the Earth is *6,371.0* kilometers. 

Now we can divide these and convert to hours to see how long it would take.

```
 6371.0 km / 4000ft/s as hours
 ```
 equals

```
 1.45 hours
 ```

 So pretty fast. In fact. 
 
 Oh, wait, That's not right. We are using the radius of the earth, not the circumference.  We know the circumferce of a circle is 2\*pi\*radius. Let's try that again.

``` javascript
(6371.0 km * 3.14 * 2) / 4000ft/s as hours  
```
gives us 9.11 hours.

So still pretty fast. He could almost go three times around the earth in a single 24 hour day.


Programming is both fun and useful. We can instruct computers to help us answer all sorts of interesting questions.  In the next section we'll learn about groups of numbers called lists, and how to do interesting math with them.


# Lists


# symbols and goes to syntax

# charts from lists and datasets


- Charts and datasets
- Sounds and images
