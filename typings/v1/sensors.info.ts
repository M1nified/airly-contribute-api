Airly.v1.prototype.sensors.info = (sensorId: number | string) => {
    return this._request(
        `/v1/sensors/${sensorId}`
    )
}