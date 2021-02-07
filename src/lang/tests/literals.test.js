import {list, string} from '../ast.js'
import {setup_parser, s, t, l} from './util.js'

beforeAll(() => setup_parser())

describe('literals',() => {
    test('integers',async ()=>{
        await t('4',s(4))
        await t('42',s(42))
        await t('4_2',s(42))
    })
    test('floating point', async () => {
        await t('4.2',s(4.2))
        await t('04.2',s(4.2))
        await t('4.20',s(4.2))
        await t('4_._2',s(4.2))
    })

    test('hex', async () => {
        await t('0x42',s(0x42))
        await t('0xFF',s(0xFF))
    })

    test('lists',async  () => {
        await t('[4,2,42]',l(4,2,42))
        await t('[4, 2, 42]',l(4,2,42))
        await t('[4_, _2, 4_2]',l(4,2,42))
        await t('[4.2, 02.4, 4_2]',l(4.2,2.4,42))
    })

    test('strings',async  () => {
        await t(`"fortytwo"`,string('fortytwo'))
        await t(`"forty two"`,string('forty two'))
        await t(`'forty two'`,string('forty two'))
        await t(`["forty two",42]`,list([string('forty two'),s(42)]))
    })

    // test('booleans',async () => {
    //     await t("true",boolean(true))
    //     await t("TRUE",boolean(true))
    //     await t("false",boolean(false))
    //     await t("FaLsE",boolean(false))
    // })
})