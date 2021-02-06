import {scalar} from '../src/lang/ast.js'
import {eval_ast} from './util.js'

function eval_simple_unit_conversion() {
    const s =(n,u) => scalar(n,u)
    eval_ast('numbers with units',[
        ['42m',scalar(42,'meter')],
        ['42m as feet',s(137.795,'foot')],
        ['42ft',scalar(42,'foot')],
        ['42m',s(42,'meter')],
        ['42km',s(42,'kilometer')],
        ['40m as feet',s(131.234,'foot')],
        ['42km as m',s(42*1000,'meter')],
        ['42000m as km',s(42,'kilometer')],
        // ["42 square miles",42,'mile',2);
        // ["50mm", 50,'millimeters',1);
        ['50mm',s(50,'millimeter')],
        // ["50in", 50, 'inches');
        ['50in',s(50,'inch')],
        // ["50in * 5", 50*5,'inches');
        // ["50 * 5in", 50*5,'inches');
        // ["1km+500m", 1500,'meters');
        // ['3ft + 6ft as meters',2.7432,'meters');
        // ['(3ft + 6ft) as feet',9,'feet');
        // ['20000 leagues',20*1000,'league');
        // ['20000 leagues as km',20*1000*4,'kilometer');
        ['3mi',s(3,'mile')],
        ['3miles',s(3,'mile')],
        // ['3mi as km',s(4.82803,'kilometers')],
        // ['2ft/2',1,"feet");
        // ['2/2ft',1,"feet");
        // ['2ft*2',4,"feet");
        // ['2*2ft',4,"feet");
        ['1 + 2 + 3 + 4',s(10)],
        // ['1 + 2 * 3 + 4',s( 11,'none');
        // ['4ft - 5ft',s( -1,'feet');
        // ['4ft * 5ft',s( 20,'feet',2);
        // ['4ft / 2ft',s(  2,'none');
        ['4 + 5 + 6', s(15)],
        ['4 + 5 * 6', s(34)],
        // ['(4+5) * 6',s( 54,'none');
        // ['4 + (5*6)',s( 34,'none');
        // ['(1+2)*(3+4)',s( 21,'none');
        // ['1ft * 2ft * 3ft',s( 6,'feet',3);
        ['4ft as meter',s(1.2192,'meter')],
        ['4ft as m',s(1.2192,'meter')],
        ['4ft as meters',s(1.2192,'meter')],
        ['4ft as inch',s(4*12,'inch')],
        ['4ft',s( 4,'foot')],
        // ['4ft/2ft',s(2,'none');
        // ['4ft/2m',s(0.6096,'none');
        // //['4ft/2gal',s(3,'none');//should error
        // ['(4+5)*6',s((4+5)*6,'none');
        ['4+5*6',s(4+(5*6))],
        // ['4+(5*6)',s(4+(5*6))],
        // //['4ft - 2gal');//should error
        // ['4ft * 2sqft',s(8,'feet',s(3);
        // ['4m + 12ft as m',s(4 + 3.6576,'m');
        // ['4mm + 12ft as mm',s(4 + (3.6576/0.001),'mm');
        // ['40mm + 40cm + 4m',s(4.440,'m');
    ])
}

eval_simple_unit_conversion()

/*
test("area units", function(t) {
    compareUnit(t,'8ft^2',8,'foot',2);
    compareUnit(t,'(8ft)^2',64,'foot',1);
    compareUnit(t,"1 square miles as acres",1*640,"acre");
    compareUnit(t,"200ft * 300ft as acres",1.3774105,"acre");
    compareUnit(t,"42 mi^2",42,'mile',2);
    compareUnit(t,'10 square miles',10,'mile',2);
    //compareUnit(t,'10 sq mi',10,'mile',2);
    compareUnit(t,'10 square meters',10,'meter',2);
    //compareUnit(t,'10 sq m',10,'meter',2);
    compareUnit(t,'9 sqft',9,'feet',2);
    compareUnit(t,'9ft * 9m',24.6888,'meter',2);
    compareUnit(t,'8m * 9ft',236.2204724,'foot',2);
    compareUnit(t,'3ft * 6ft',18,'foot',2);
    //compareUnit(t,'(3ft * 6ft) as sq mi',6.4566e-7,'miles',2);
    compareUnit(t,'1000ac',1000,'acres');
    //compareUnit(t,'1000ac as sq m',1000*4046.8564224,'meters',2);
    //compareUnit(t,'40 acres as sq mi',0.0625,'miles',2);
    //compareUnit(t,'25sqmi + 1000acres',68796559.1808,'meters',2);
    compareUnit(t,'10m^2',10,'meter',2);

    compareUnit(t,'8 acres',8,'acre');
    compareUnit(t,'1m * 2m as acre',0.000494211,'acre');
    compareUnit(t,'1km * 2km as acre',494.211,'acre');
    compareUnit(t,'1m * 2m as square feet',21.5278,'feet',2);
    //compareUnit(t,'1m * 2m as sq ft',21.5278,'feet',2);
    compareUnit(t,'1m * 2m as ft^2' ,21.5278,'feet',2);
    compareUnit(t,'1m * 2m as sqft' ,21.5278,'feet',2);
    compareUnit(t,'1m * 2m as square feet' ,21.5278,'feet',2);
    t.end();
});



test("complex units",(t)=>{
    compareComplexUnit(t, '1ft/s', new LiteralNumber(1).withUnits([['foot',1]],[['second',1]]));
    compareComplexUnit(t,'3ft * (1ft/s)', new LiteralNumber(3).withUnits([['foot',2]],[['second',1]]));
    compareComplexUnit(t,'3ft / (1 ft/s)',new LiteralNumber(3).withUnits([['second',1]]));
    compareComplexUnit(t,'3ft / (1 ft/s) as second',new LiteralNumber(3).withUnits('second'));
    compareComplexUnit(t,'3ft / (1 ft/min) as second',new LiteralNumber(3*60).withUnit('second'));
    compareComplexUnit(t,'1m / (1ft/s)', new LiteralNumber(3.28084).withUnit([['second',1]],[]));
    compareComplexUnit(t,'60 miles', new LiteralNumber(60).withUnit('mile'));
    compareComplexUnit(t,'60 miles/hour', new LiteralNumber(60).withUnit(['mile'],['hour']));
    compareComplexUnit(t,'60 miles/hour * 2', new LiteralNumber(120).withUnit(['mile'],['hour']));
    compareComplexUnit(t,'2*60 miles/hour * 1', new LiteralNumber(120).withUnit(['mile'],['hour']));
    compareComplexUnit(t,'60 min * 60 mi/hr', new LiteralNumber(60).withUnit(['mile'],[]));
    compareComplexUnit(t,'9.8 m/s^2', new LiteralNumber(9.8).withUnit([['meter',1]],[['second',2]]));
    compareComplexUnit(t,'9.8 m/s^2 * 10 s', new LiteralNumber(98.0).withUnit([['meter']],[['second']]));
    compareComplexUnit(t,'10 s * 9.8 m/s^2', new LiteralNumber(98.0).withUnit('meter','second'));
    compareComplexUnit(t,'60 mile / 1 hour', new LiteralNumber(60).withUnit('mile','hour'));
    compareComplexUnit(t,'4000 mile * 1 hour', new LiteralNumber(4000).withUnit(['mile','hour']));
    compareComplexUnit(t,'4000 mile * 1 hour / 40 mile', new LiteralNumber(100).withUnit('hour'));
    compareComplexUnit(t,'4000 mile / (40 mi/hr)', new LiteralNumber(100).withUnit('hour'));
    compareComplexUnit(t,'600000 meter / (40 mi/hr)', new LiteralNumber(9.32).withUnit('hour'));
    compareComplexUnit(t,'1/10m/s',new LiteralNumber(0.1).withUnit('second','meter'));
    compareComplexUnit(t,'5m / 5m/s',new LiteralNumber(1).withUnit('second'));
    compareComplexUnit(t,'5km / 5m/s',new LiteralNumber(1000).withUnit('second'));
    const ER = 6371.008;
    compareComplexUnit(t,'earth.radius / 4000 meter/second', new LiteralNumber(ER*1000/4000).withUnit('second'));
    compareComplexUnit(t,'earth.radius / 4000 feet/second', new LiteralNumber(ER*1000/1219.2).withUnit('second'));
    compareComplexUnit(t,'earth.radius / 4000 feet/second as hour', new LiteralNumber((ER*1000/1219.2)/60/60).withUnit('hour'));
    compareComplexUnit(t,'4000mi / (4000 ft/second)',new LiteralNumber(5280).withUnit('second'));
    compareComplexUnit(t,'4000mi / (2727 mi/hr)',new LiteralNumber(1.46).withUnit('hour'));
    compareComplexUnit(t,'earth.radius / 4000 m/s as hours',new LiteralNumber(0.44).withUnit('hour'));


    //7. how long does it take light to get from the sun to the earth?
    //compareComplexUnit(t,'92_000_000 miles / lightspeed as minutes', new Literal(8).withUnit('minute'));
    //how long does it take to drive around the world at 60 mph
    compareComplexUnit(t,'earth.radius * 2 * pi / 60 km/hr as days', new LiteralNumber(ER*Math.PI*2/60/24).withUnit('day'));
    //How many earths could fit inside jupiter?
    var JR = 69911;
    compareComplexUnit(t,'jupiter.radius^3 * 4/3 * pi', new LiteralNumber(Math.pow(JR,3)*4/3*Math.PI).withUnits([['kilometer',3]]));
    compareComplexUnit(t,'4/3 * pi * jupiter.radius^3 ', new LiteralNumber(Math.pow(JR,3)*4/3*Math.PI).withUnits([['kilometer',3]]));
    compareComplexUnit(t,'(jupiter.radius^3 * 4/3 * pi) / (earth.radius^3 * 4/3 * pi)', new LiteralNumber(1321.33));
    compareComplexUnit(t,'earth.radius^3 * 4/3 * pi', new LiteralNumber(Math.pow(ER,3)*4/3*Math.PI).withUnits([['kilometer',3]]));
    t.end();
});



test("duration units", function(t) {
    compareUnit(t,'3hr',3,'hours');
    compareUnit(t,'30min',30,'minutes');
    compareUnit(t,'3.8hr as seconds',3.8*60*60,'seconds');
    compareUnit(t,'100000s as days',100000/(60*60*24),'days');
    compareUnit(t,'3hr + 30min as seconds',3.5*60*60,'seconds');
    compareUnit(t,'3hr + 30min as minutes',3*60+30,'minutes');
    //compareUnit(t,"date('august 31st, 1975')", moment([1975,8-1,31]),'date','date');
    //compareUnit(t,"date(year:1975)",moment('1975','YYYY'),'date','date');
    //compareUnit(t,"date('1975-08-31',format:'YYYY MM DD')",moment([1975,8-1,31]),'date','date');
    t.end();
});


test("mass units", function(t) {
    compareUnit(t,"50g",50,'gram');
    compareUnit(t,"50kg", 50,'kilograms');
    compareUnit(t,'50lb', 50,'pounds');
    compareUnit(t,'50oz', 50,'ounces');
    compareUnit(t,'50lb as grams',22679.6,'grams');
    compareUnit(t,'50oz as grams',1417.475, 'grams');
    compareUnit(t,'50oz + 60oz',110, 'oz');
    compareUnit(t,'1oz + 1lb',17*1/16.0,'pounds');
    compareUnit(t,'(1oz + 1lb) as grams',481.942,'gram');
    compareUnit(t,'50g * 2',100,'grams');
    compareUnit(t,'50 * 2g',100,'grams');
    compareUnit(t,"5lbs + 4oz",84,"ounces");
    compareUnit(t,"(5lbs + 4g) as kilograms",2.26796,"kilograms");
    t.end();
});
unittests("duration units", [
    ["1 second", new LiteralNumber(1).withUnit('second')],
    ['1s', new LiteralNumber(1).withUnit('second')],
    ['120s as minutes', new LiteralNumber(2).withUnit('minute')],
    ['7200s as hours', new LiteralNumber(2).withUnit('hour')],
    ['120min as hours', new LiteralNumber(2).withUnit('hour')],
    ['12 hr as days', new LiteralNumber(0.5).withUnit('day')],
    ['90 days as months', new LiteralNumber(3).withUnit('month')],
    ['730 days as years', new LiteralNumber(2).withUnit('year')],
    ['5 years as seconds', new LiteralNumber(157680000).withUnit('second')]
]);


tests("constants", [
    ['Pi',Math.PI],
    ['pi',Math.PI],
    ['earth.radius as mi',3958.76084],
    ['jupiter.radius as km', 69911]
]);


test("volume units", function(t) {
    compareUnit(t,'5gal',5,'gallons');
    compareUnit(t,'5cups',5,'cups');
    compareUnit(t,'5cups as gal',5/16,'gal');
    compareUnit(t,'5gal as cups',5*16,'cups');
    compareUnit(t,'3tbsp',3,'tablespoons');
    compareUnit(t,'3tsp',3,'teaspoons');
    compareUnit(t,'3l',3,'liters');
    compareUnit(t,'3ml',3,'milliliters');
    compareUnit(t,'3ml as liters',0.003,'liters');
    compareUnit(t,'3tsp as tablespoons',1.0,'tablespoons');
    compareUnit(t,'3tbsp as teaspoons',9,'teaspoons');
    //compareUnit(t,'21 cuft',22,'foot',3);
    compareUnit(t,'3 cm^3',3,'cm',3);
    compareUnit(t,'1000000 cm^3 as m^3',1,'m',3);
    compareUnit(t,' 1m^3 as cm^3',1000000,'cm',3);
    compareUnit(t,'3 cm^3 as ml',3,'milliliter');
    compareUnit(t,'3ft * 3ft * 3ft',27,'foot',3);
    compareUnit(t,'(3ft * 3ft * 3ft) as gallon',201.974,'gallon');
    compareUnit(t,'1ft^3',1,'foot',3);
    compareUnit(t,'4 qt',4,'quart');
    compareUnit(t,'4 pt',4,'pint');
    compareUnit(t,'4 qt as gallon',1,'gallon');
    compareUnit(t,'4 pt as gallon',0.5,'gallon');
    compareUnit(t,'4 l',4,'liter');
    compareUnit(t,'4ml',4,'ml');
    compareUnit(t,'1l as gal',0.264172,'gal');
    compareUnit(t,'4l + 3gal',3+1.05669,'gal');
    compareUnit(t,'1l + 15l as ml',16*1000,'ml');
    compareUnit(t,'(4l + 3gal) as ml',(4+3*3.78541)*1000,'milliliter');
    compareUnit(t,'48tsp as cups',1,'cup');
    compareUnit(t,'16tbsp as cups',1,'cup');
    compareUnit(t,'16cups as gal',1,'gal');
    compareUnit(t,'1tsp as gal',0.00130208,'gal');
    compareUnit(t,'1tsp as liter',0.00492892,'liter');
    compareUnit(t,'1tsp as ml',4.92892,'ml');
    compareUnit(t,'4ml as tsp',0.811537,'tsp');
    compareUnit(t,'4ml as tbsp',0.270512,'tbsp');
    compareUnit(t,'3 cups + 1 cups',4,'cups');
    compareUnit(t,'3 cups - 1 cups',2,'cups');
    //compareUnit(t,'1/2 cups',0.5,'cups');
    //compareUnit(t,'3 cups + (1/2cups)',3.5,'cups');
    compareUnit(t,'1ft * 2ft * 3ft', 6,'feet',3);
    compareUnit(t,'1ft * 2ft * 3ft as liter', 169.901,'liter');
    compareUnit(t,'1m * 2m * 3m as liter', 6000,'liter');
    compareUnit(t,'4ft * 5ft * 6ft as gallon',897.659,'gallon');
    //compareUnit(t,'4 cuft', 4,'feet',3);
    //compareUnit(t,'4 cu ft', 4,'feet',3);
    compareUnit(t,'4 cubic feet', 4,'feet',3);
    compareUnit(t,'4 ft^3', 4,'feet',3);
    //compareUnit(t,'4 cuft as gal', 29.9221,'gal',1);
    t.end();
});

*/

