// Search from a service journey's start to end
export const serviceJourneyTestData = {
  scenarios: [
    {
      query: {
        to: {
          name: 'Melhus skysstasjon',
          coordinates: {
            latitude: 63.284753,
            longitude: 10.277964
          },
          place: 'NSR:StopPlace:42547'
        },
        from: {
          name: 'Hesttrøa',
          coordinates: {
            latitude: 63.294611,
            longitude: 10.332289
          },
          place: 'NSR:StopPlace:41699'
        },
        when: '',
        arriveBy: false
      }
    }
  ]
};
