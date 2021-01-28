class JoshCache {
    constructor() {
        this.data = {}
    }
    contains(url) {
        return this.data.hasOwnProperty(url)
    }
    is_outdated(url) {
        let age_ms = Date.now()-this.data[url].timestamp
        console.log("diff is",age_ms)
        if(age_ms > 60*60*1000) {
            console.log("more than 1hr old")
            return true
        }
        return false
    }
    put(url,payload) {
        this.data[url] = {
            timestamp: Date.now(),
            payload:payload
        }
    }
    get(url) {
        return this.data[url].payload
    }
}

const CACHE = new JoshCache()

export function cached_json_fetch(url) {
    if(CACHE.contains(url)) {
        if(!CACHE.is_outdated(url)) {
            console.log("fetching from cache")
            return Promise.resolve(CACHE.get(url))
        }
    }
    console.log("really fetching",url)
    return fetch(url).then(r => r.json()).then(json =>{
        CACHE.put(url,json)
        return json
    })
}