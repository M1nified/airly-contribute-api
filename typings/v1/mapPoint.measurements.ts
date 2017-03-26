Airly.v1.mapPoint.measurements = (latitude: number | string, longitude: number | string, historyHours?: number | string, historyResolutionHours?: number | string) => {
    return this._request(
        `/v1/sensors/history`,
        {
            latitude,
            longitude,
            historyHours,
            historyResolutionHours
        }
    )
}
