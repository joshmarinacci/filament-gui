export async function dataset(name) {
    let url = `https://api.silly.io/api/list/${name}`
    console.log("loading",url)
    return await fetch(url).then(r => r.json())
}

export async function stockhistory(name) {
    let url = `https://query1.finance.yahoo.com/v7/finance/download/${name}?period1=1579393259&period2=1611015659&interval=1d&events=history&includeAdjustedClose=true`
    console.log("loading url",url)
    return await fetch(url).then(r => r.text()).then(d => {
        console.log(d)
        return {
            data: {
                schema:{
                    properties:{

                    }
                },
                items:[]
            }
        }
    })
}