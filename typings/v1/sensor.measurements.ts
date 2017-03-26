Airly.v1.prototype.sensor.measurements = (sensorId: number | string, historyHours?: number | string, historyResolutionHours?: number | string) => {
    return this._request(
        `/v1/sensors/history`,
        {
            sensorId,
            historyHours,
            historyResolutionHours
        }
    )
}
