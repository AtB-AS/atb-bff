import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js'
import {bffHeaders} from "../../utils/headers.js";

export function realtime(quayIds, startTime, limit = 10){
    const requestName = "realtime";
    let url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayIds}&startTime=${startTime}&limit=${limit}`

    let res = http.get(url,
        {
            tags: { name: requestName },
            bffHeaders
        }
    );

    //NOTE: Mainly for performance, add a trend metric for the requestName. Have to be defined in 'configuration.js:reqNameList'
    //Log the request in a Trend metric
    //metrics.log(requestName, res.timings.duration);

    let expects = [
        {'check': 'expectedStatus', 'expect': res.status === 200},
        {'check': 'expectedStatus2', 'expect': res.status === 500},
        {'check': 'expectedStatus3', 'expect': res.status === 500},
        //{'check': 'offer_id exists', 'expect': typeof res.json('#.offer_id') !== 'undefined'}
        //{'check': 'order_id exists', 'expect': typeof res.json('order_id') !== 'undefined'},
        //{'check': 'order_id length', 'expect': res.json('order_id').length === 8}
        //{'check': 'confirmation is ok', 'expect': res.body.includes("Thanks! You can safely close this window")}
    ]
    metrics.addFailureIfMultipleChecks(res, requestName, expects)
}

export function realtimeCopy(quayIds, startTime, limit = 10){
    const requestName = "realtimeCopy";
    let url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayIds}&startTime=${startTime}&limit=${limit}`

    let res = http.get(url,
        {
            tags: { name: requestName },
            bffHeaders
        }
    );

    let expects = [
        {'check': 'expectedStatus', 'expect': res.status === 200},
    ]
    metrics.addFailureIfMultipleChecks(res, requestName, expects)
}