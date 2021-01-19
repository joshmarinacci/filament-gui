import {parse as parseDate} from 'date-fns'

let AV_API_KEY= '1S4KT3P0F4XXIVRL'

export async function dataset(name) {
    let url = `https://api.silly.io/api/list/${name}`
    console.log("loading",url)
    return await fetch(url).then(r => r.json())
}


export async function stockhistory(symbol) {
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${AV_API_KEY}`
    return await fetch(url).then(r => r.json()).then(d => {
        let hash_data = d['Monthly Time Series']
        let data = Object.entries(hash_data).map(([name,obj]) => {
            return {
                date:parseDate(name,'yyyy-MM-dd',new Date()),
                close: parseFloat(obj['4. close'])
            }
        })
        console.log("final data",data.length)
        return {
            data: {
                schema:{
                    properties:{

                    }
                },
                items:data
            }
        }
    })
}