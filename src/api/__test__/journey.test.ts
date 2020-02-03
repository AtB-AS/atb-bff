import Hapi from '@hapi/hapi'
import journeyRoutes from '../journey'
import { IJourneyService } from '../../service/interface'
import { Result } from '@badrap/result'
import { createServer, initializePlugins } from '../../server'
import { randomPort } from './common'

let server: Hapi.Server
const svc: jest.Mocked<IJourneyService> = {
    getTripPatterns: jest.fn((args: any): any =>
        Result.ok(Promise.resolve([])),
    ),
    getTrips: jest.fn((args: any): any => Result.ok(Promise.resolve([]))),
}

beforeEach(async () => {
    server = createServer({
        port: randomPort(),
    })

    await initializePlugins(server)
    journeyRoutes(server)(svc)
    await server.initialize()
    await server.start()
})

afterEach(async () => {
    await server.stop()
})

describe('GET /journey/trip', () => {
    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/journey/trip?from=Trondheim&to=Oslo',
        })

        expect(res.statusCode).toBe(200)
    })

    it('responds with 400 for missing required parameters', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/journey/trip?from=Trondheim',
        })

        expect(res.statusCode).toBe(400)
    })
})

describe('POST /journey/trip', () => {
    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/journey/trip',
            payload: {
                from: {
                    name: 'Trondheim',
                    coordinates: {
                        latitude: 63.43,
                        longitude: 10.34,
                    },
                },
                to: {
                    name: 'Oslo',
                    coordinates: {
                        latitude: 59.9139,
                        longitude: 10.7522,
                    },
                },
            },
        })

        expect(res.statusCode).toBe(200)
    })
})
