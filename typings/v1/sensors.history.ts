Airly.v1.prototype.sensors.history = (southwestLat: string | number, southwestLong: string | number, northeastLat: string | number, northeastLong: string | number, fromTime: string, tillTime: string) => {
    return this._request(
        `/v1/sensors/history`,
        {
            southwestLat,
            southwestLong,
            northeastLat,
            northeastLong,
            fromTime,
            tillTime
        }
    )
}
