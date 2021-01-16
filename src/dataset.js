export async function dataset(name) {
    let url = `https://api.silly.io/api/list/${name}`
    console.log("loading",url)
    return await fetch(url).then(r => r.json())
}