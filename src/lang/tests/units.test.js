import {all, all_close_scalar, s, setup_parser, t} from './util.js'
import {scalar} from '../ast.js'

beforeAll(() => setup_parser())


describe('length',() => {
    test('metric', async () => {
        await all([
            ['42m',scalar(42,'meter')],
            ['42ft',scalar(42,'foot')],
            ['42km',s(42,'kilometer')],
            ['42km as m',s(42*1000,'meter')],
            ['42000m as km',s(42,'kilometer')],
            ['50mm',s(50,'millimeter')],
        ])
    })

    test('us standard', async () =>{
        await all([
            ['42ft',scalar(42,'foot')],
            ['50in',s(50,'inch')],
            ['3mi',s(3,'mile')],
            ['3miles',s(3,'mile')],
            ['20000leagues',s(20*1000,'league')],
        ])
    })

    test('metric to us', async() => {
        await all_close_scalar([
            ['42m as feet',s(137.795,'foot')],
        ])
    })

    test('us to metric',async() => {
        await all_close_scalar([
            ['3mi as km',s(4.82803,'kilometers')],
            ['4ft as meter',s(1.2192,'meter')],
            ['4ft as m',s(1.2192,'meter')],
            ['4ft as meters',s(1.2192,'meter')],
            ['4ft as inch',s(4*12,'inch')],
            ['4ft',s( 4,'foot')],
            // ['20000 leagues as km',s(20*1000*4,'kilometer')],
        ])
    })

    test('unit multiply and divide',async() => {
        await all_close_scalar([
            ["50in * 5",s( 50*5,'inch')],
            ["50 * 5in", s(50*5,'inch')],
            ['2ft/2',s(1,"feet")],
            ['2/2ft',s(1,"feet")],
            ['2ft*2',s(4,"feet")],
            ['2*2ft',s(4,"feet")],
            ['4ft * 5ft',s( 20,'feet',2)],
            ['4ft / 2ft',s(  2)],
            ['1ft * 2ft * 3ft',s( 6,'feet',3)],
        ])
    })

    test('unit add and subtract',async () => {
            await all_close_scalar([
                // ['4ft + 5',s(9,'feet')], // should error
                ['4ft + 5ft',s( 9,'feet')],
                ['4ft - 5ft',s( -1,'feet')],
                ['3ft + 6ft as meters',s(2.7432,'meters')],
                ['(3ft + 6ft) as feet',s(9,'feet')],
                ["1km+500m", s(1500,'meters')],
                ["500m+1km", s(1.500,'kilometers')],
                ['4m + 12ft',s(13.1234 + 12,'ft')],
                ['4m + 12ft as m',s(4 + 3.6576,'m')],
                ['40mm + 40cm + 4m',s(4.440,'m')],
                ['4mm + 12ft',s(4/304.8 + 12,'ft')],
                ['4mm + 12ft as mm',s(4 + 3657.6,'mm')],
               // ['4ft/2ft',s(2,'none')],
        //     // ['4ft/2m',s(0.6096,'none')],
        //     // //['4ft/2gal',s(3,'none')],//should error
        //     ['4ft - 2gal')],//should error
        ])
    })

})
describe('complex',()=>{
    test.skip('complex', ()=>{
        /*
        test("complex units",(t)=>{
            compareComplexUnit(t, '1ft/s', new LiteralNumber(1).withUnits([['foot',1]],[['second',1]]))],
            compareComplexUnit(t,'3ft * (1ft/s)', new LiteralNumber(3).withUnits([['foot',2]],[['second',1]]))],
            compareComplexUnit(t,'3ft / (1 ft/s)',new LiteralNumber(3).withUnits([['second',1]]))],
            compareComplexUnit(t,'3ft / (1 ft/s) as second',new LiteralNumber(3).withUnits('second'))],
            compareComplexUnit(t,'3ft / (1 ft/min) as second',new LiteralNumber(3*60).withUnit('second'))],
            compareComplexUnit(t,'1m / (1ft/s)', new LiteralNumber(3.28084).withUnit([['second',1]],[]))],
            compareComplexUnit(t,'60 miles', new LiteralNumber(60).withUnit('mile'))],
            compareComplexUnit(t,'60 miles/hour', new LiteralNumber(60).withUnit(['mile'],['hour']))],
            compareComplexUnit(t,'60 miles/hour * 2', new LiteralNumber(120).withUnit(['mile'],['hour']))],
            compareComplexUnit(t,'2*60 miles/hour * 1', new LiteralNumber(120).withUnit(['mile'],['hour']))],
            compareComplexUnit(t,'60 min * 60 mi/hr', new LiteralNumber(60).withUnit(['mile'],[]))],
            compareComplexUnit(t,'9.8 m/s^2', new LiteralNumber(9.8).withUnit([['meter',1]],[['second',2]]))],
            compareComplexUnit(t,'9.8 m/s^2 * 10 s', new LiteralNumber(98.0).withUnit([['meter']],[['second']]))],
            compareComplexUnit(t,'10 s * 9.8 m/s^2', new LiteralNumber(98.0).withUnit('meter','second'))],
            compareComplexUnit(t,'60 mile / 1 hour', new LiteralNumber(60).withUnit('mile','hour'))],
            compareComplexUnit(t,'4000 mile * 1 hour', new LiteralNumber(4000).withUnit(['mile','hour']))],
            compareComplexUnit(t,'4000 mile * 1 hour / 40 mile', new LiteralNumber(100).withUnit('hour'))],
            compareComplexUnit(t,'4000 mile / (40 mi/hr)', new LiteralNumber(100).withUnit('hour'))],
            compareComplexUnit(t,'600000 meter / (40 mi/hr)', new LiteralNumber(9.32).withUnit('hour'))],
            compareComplexUnit(t,'1/10m/s',new LiteralNumber(0.1).withUnit('second','meter'))],
            compareComplexUnit(t,'5m / 5m/s',new LiteralNumber(1).withUnit('second'))],
            compareComplexUnit(t,'5km / 5m/s',new LiteralNumber(1000).withUnit('second'))],
            const ER = 6371.008],
            compareComplexUnit(t,'earth.radius / 4000 meter/second', new LiteralNumber(ER*1000/4000).withUnit('second'))],
            compareComplexUnit(t,'earth.radius / 4000 feet/second', new LiteralNumber(ER*1000/1219.2).withUnit('second'))],
            compareComplexUnit(t,'earth.radius / 4000 feet/second as hour', new LiteralNumber((ER*1000/1219.2)/60/60).withUnit('hour'))],
            compareComplexUnit(t,'4000mi / (4000 ft/second)',new LiteralNumber(5280).withUnit('second'))],
            compareComplexUnit(t,'4000mi / (2727 mi/hr)',new LiteralNumber(1.46).withUnit('hour'))],
            compareComplexUnit(t,'earth.radius / 4000 m/s as hours',new LiteralNumber(0.44).withUnit('hour'))],


            //7. how long does it take light to get from the sun to the earth?
            //compareComplexUnit(t,'92_000_000 miles / lightspeed as minutes', new Literal(8).withUnit('minute'))],
            //how long does it take to drive around the world at 60 mph
            compareComplexUnit(t,'earth.radius * 2 * pi / 60 km/hr as days', new LiteralNumber(ER*Math.PI*2/60/24).withUnit('day'))],
            //How many earths could fit inside jupiter?
            var JR = 69911],
            compareComplexUnit(t,'jupiter.radius^3 * 4/3 * pi', new LiteralNumber(Math.pow(JR,3)*4/3*Math.PI).withUnits([['kilometer',3]]))],
            compareComplexUnit(t,'4/3 * pi * jupiter.radius^3 ', new LiteralNumber(Math.pow(JR,3)*4/3*Math.PI).withUnits([['kilometer',3]]))],
            compareComplexUnit(t,'(jupiter.radius^3 * 4/3 * pi) / (earth.radius^3 * 4/3 * pi)', new LiteralNumber(1321.33))],
            compareComplexUnit(t,'earth.radius^3 * 4/3 * pi', new LiteralNumber(Math.pow(ER,3)*4/3*Math.PI).withUnits([['kilometer',3]]))],
            t.end()],
        })],

         */
    })

})
describe('duration',()=>{
    test('standard',async ()=>{
        await all([
            ['4hr',s(4,'hour')],
            ['42min',s(42,'minutes')],
            ['4.2hr as seconds',s(4.2*60*60,'second')],
            ['42_000_000s as days',s(42000000/(60*60*24),'days')],
            ['5years as seconds', s(157680000,'second')],
            ['120s as minutes', s(2,'minute')],
            ['7200s as hours', s(2,'hour')],
            ['120min as hours', s(2,'hour')],
            ['12hr as days', s(0.5,'day')],
            ['90days as months', s(3,'month')],
            ['730days as years', s(2,'year')],
        ])
    })

        /*
            // compareUnit(t,'100000s as days',100000/(60*60*24),'days')],
            compareUnit(t,'3hr + 30min as seconds',3.5*60*60,'seconds')],
            compareUnit(t,'3hr + 30min as minutes',3*60+30,'minutes')],
            //compareUnit(t,"date('august 31st, 1975')", moment([1975,8-1,31]),'date','date')],
            //compareUnit(t,"date(year:1975)",moment('1975','YYYY'),'date','date')],
            //compareUnit(t,"date('1975-08-31',format:'YYYY MM DD')",moment([1975,8-1,31]),'date','date')],
        ])],
         */
})
describe('mass',()=>{
    test('standard',async ()=> {
        await all([
            ["50g", s(50, 'gram')],
            ["50kg", s(50, 'kilograms')],
            ['50lb', s(50, 'pounds')],
            ['50oz', s(50, 'ounces')],
            ['50lb as grams', s(22679.6, 'grams')],
            ['50oz as grams', s(1417.475, 'grams')],
            // ['50oz + 60oz', s(110, 'oz')],
            // ['1oz + 1lb', s(17 * 1 / 16.0, 'pounds')],
            // ['(1oz + 1lb) as grams', s(481.942, 'gram')],
            // ['50g * 2', s(100, 'grams')],
            // ['50 * 2g', s(100, 'grams')],
            // ["5lbs + 4oz", s(84, "ounces")],
            // ["(5lbs + 4g) as kilograms", s(2.26796, "kilograms")],
        ])
    })
})
describe("volume",()=>{
    test('us',async ()=>{
        await all_close_scalar([
            ['5gal',s(5,'gallons')],
            ['5cups',s(5,'cups')],
            ['5cups as gal',s(5/16,'gal')],
            ['5gal as cups',s(5*16,'cups')],
            ['3tbsp',s(3,'tablespoons')],
            ['3tsp',s(3,'teaspoons')],
            ['3tsp as tablespoons',s(1.0,'tablespoons')],
            ['3tbsp as teaspoons',s(9,'teaspoons')],
            ['4qt',s(4,'quart')],
            ['4pt',s(4,'pint')],
            ['4qt as gallon',s(1,'gallon')],
            ['4pt as gallon',s(0.5,'gallon')],
            ['48tsp as cups',s(1,'cup')],
            ['16tbsp as cups',s(1,'cup')],
            ['16cups as gal',s(1,'gal')],
            ['1tsp as gal',s(0.00130208,'gal')],
            ['1tsp as liter',s(0.00492892,'liter')],
            ['1tsp as ml',s(4.92892,'ml')],
            ['4ml as tsp',s(0.811537,'tsp')],
            ['4ml as tbsp',s(0.270512,'tbsp')],
        ])
    })
    test('metric',async ()=>{
        await all_close_scalar([
            ['3l',s(3,'liters')],
            ['3ml',s(3,'milliliters')],
            ['3ml as liters',s(0.003,'liters')],
            ['4l',s(4,'liter')],
            ['4ml',s(4,'ml')],
        ])
    })
    test('other',async ()=>{
        await all([
        ])
            /*
            test("volume units", function(t) {
                //['21 cuft',22,'foot',3)],
                ['3 cm^3',3,'cm',3)],
                ['1000000 cm^3 as m^3',1,'m',3)],
                [' 1m^3 as cm^3',1000000,'cm',3)],
                ['3 cm^3 as ml',3,'milliliter')],
                ['3ft * 3ft * 3ft',27,'foot',3)],
                ['(3ft * 3ft * 3ft) as gallon',201.974,'gallon')],
                ['1ft^3',1,'foot',3)],
                ['1l as gal',0.264172,'gal')],
                ['4l + 3gal',3+1.05669,'gal')],
                ['1l + 15l as ml',16*1000,'ml')],
                ['(4l + 3gal) as ml',(4+3*3.78541)*1000,'milliliter')],
                ['3 cups + 1 cups',4,'cups')],
                ['3 cups - 1 cups',2,'cups')],
                //['1/2 cups',0.5,'cups')],
                //['3 cups + (1/2cups)',3.5,'cups')],
                ['1ft * 2ft * 3ft', 6,'feet',3)],
                ['1ft * 2ft * 3ft as liter', 169.901,'liter')],
                ['1m * 2m * 3m as liter', 6000,'liter')],
                ['4ft * 5ft * 6ft as gallon',897.659,'gallon')],
                //['4 cuft', 4,'feet',3)],
                //['4 cu ft', 4,'feet',3)],
                ['4 cubic feet', 4,'feet',3)],
                ['4 ft^3', 4,'feet',3)],
                //['4 cuft as gal', 29.9221,'gal',1)],
                t.end()],
            })],
             */

    })
})
describe('area',()=>{
    test('us',async ()=> {
        await all([
            // ['9sqft',s(9,'foot',2)],
            ['8acres',s(8,'acre')],
            ['1000ac',s(1000,'acres')],
            // ['1000ac as sqm',s(1000*4046.8564224,'meters',2)],
        ])
    })
    test('metric',async ()=> {
        await all([
        ])
    })

    test.skip('other',async ()=>{
        await all([
            ["42 square miles",s(42,'mile',2)],
            ['8ft^2',s(8,'foot',2)],
            ['(8ft)^2',s(64,'foot',1)],
            ["1 square miles as acres",s(640,"acre")],
            ["200ft * 300ft as acres",s(1.3774105,"acre")],
            ["42 mi^2",s(42,'mile',2)],
            ['10 square miles',s(10,'mile',2)],
            //['10 sq mi',s10,'mile',s2)],
            ['10 square meters',s(10,'meter',2)],
            //['10 sq m',s10,'meter',s2)],
            ['9ft * 9m',s(24.6888,'meter',2)],
            ['8m * 9ft',s(236.2204724,'foot',2)],
            ['3ft * 6ft',s(18,'foot',2)],
            //['(3ft * 6ft) as sq mi',s6.4566e-7,'miles',s2)],
            //['40 acres as sq mi',s0.0625,'miles',s2)],
            //['25sqmi + 1000acres',s68796559.1808,'meters',s2)],
            ['10m^2',s(0,'meter',2)],

            ['1m * 2m as acre',s(0.000494211,'acre')],
            ['1km * 2km as acre',s(494.211,'acre')],
            ['1m * 2m as square feet',s(21.5278,'feet',2)],
            //['1m * 2m as sq ft',21.5278,'feet',2)],
            ['1m * 2m as ft^2' ,s(21.5278,'feet',2)],
            ['1m * 2m as sqft' ,s(21.5278,'feet',2)],
            ['1m * 2m as square feet' ,s(21.5278,'feet',2)],
        ])
    })

})
