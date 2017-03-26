interface IAirlyAPIv1 {
    heatmap?: IHeatmap
    mapPoint?: IMapPoint
    sensor?: ISensor
    sensors?: ISensors
}
interface IAirlyAPIv1Modules {
    http?: {}
    querystring?: {}
}
declare var require: any;

class AirlyAPIv1 implements IAirlyAPIv1 {
    private _apikey: string;
    protected _https: any;
    protected _querystring: any;
    constructor(apikey: string, modules: IAirlyAPIv1Modules = {}) {
        this._apikey = apikey;
        this._https = modules.http || require('https');
        this._querystring = modules.querystring || require('querystring');
    }
    protected _request(path: string, query = {}) {
        return new Promise((resolve, reject) => {
            let queryObject = typeof query === 'string' ? query : this._querystring.parse(query);
            queryObject.apikey = this._apikey;
            let queryString = this._querystring.stringify(queryObject);
            this._https.get({
                headers: {
                    accept: 'application/json'
                },
                hostname: 'airapi.airly.eu',
                path: `${path}?${queryString}`
            }, result => {
                // TODO: Add proper rejects
                switch (result.statusCode) {
                    case 400:
                        reject(400);
                        break;
                    case 401:
                        reject(401);
                        break;
                    case 403:
                        reject(403);
                        break;
                    case 404:
                        reject(404);
                        break;
                    case 500:
                        reject(500);
                        break;
                }
                let rawData = null;
                result.setEncoding('utf8');
                result.on('data', chunk => rawData += chunk);
                result.on('end', () => {
                    try {
                        resolve(JSON.parse(rawData));
                    } catch (jsonException) {
                        reject(jsonException);
                    }
                })
            });
        })
    }
}
