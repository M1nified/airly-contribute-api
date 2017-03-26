AirlyAPIv1.prototype.sensors.current = (southwestLat: string | number, southwestLong: string | number, northeastLat: string | number, northeastLong: string | number) => {
    return this._request(
        `/v1/sensors/history`,
        {
            southwestLat,
            southwestLong,
            northeastLat,
            northeastLong
        }
    )
}
