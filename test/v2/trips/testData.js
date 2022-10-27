export const tripsTestData = {
  scenarios: [
    {
      query: {
        to: {
          name: 'Studentersamfundet',
          coordinates: {
            latitude: 63.422568,
            longitude: 10.394852
          },
          place: 'NSR:StopPlace:42660'
        },
        from: {
          name: 'Prinsens gate',
          coordinates: {
            latitude: 63.431034,
            longitude: 10.392007
          },
          place: 'NSR:StopPlace:41613'
        },
        when: '',
        arriveBy: false
      },
      expectedResult: {
        legModes: [
          { pattern: 0, modes: ['foot'] },
          { pattern: 1, modes: ['bus'] },
          { pattern: 2, modes: ['bus'] }
        ],
        minimumTripPatterns: 4
      }
    },
    {
      query: {
        to: {
          name: 'Eddaparken',
          coordinates: {
            latitude: 63.422287048884975,
            longitude: 10.394009646391378
          }
        },
        from: {
          name: 'Trondheim Torg',
          coordinates: {
            latitude: 63.42987338669995,
            longitude: 10.393239260988398
          }
        },
        when: '',
        arriveBy: false
      },
      expectedResult: {
        legModes: [
          { pattern: 0, modes: ['foot'] },
          { pattern: 1, modes: ['foot', 'bus', 'foot'] },
          { pattern: 2, modes: ['foot', 'bus', 'foot'] }
        ],
        minimumTripPatterns: 4
      }
    },
    {
      query: {
        from: {
          name: 'Skansen',
          coordinates: {
            latitude: 63.43060811850891,
            longitude: 10.376745476594767
          }
        },
        to: {
          name: 'Melhus',
          coordinates: {
            latitude: 63.284594,
            longitude: 10.27745
          }
        },
        when: '',
        arriveBy: false
      },
      expectedResult: {
        legModes: null,
        minimumTripPatterns: 3
      }
    }
  ]
};
