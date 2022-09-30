/*
Scenario that distributes requests according to usage pattern
 */

import {sleep} from "k6";
import {randomNumberInclusiveInInterval} from "../utils/common.js";
import {realtime, realtimeCopy} from "./departures/departures.js";

//Scenario with std pattern
export function departuresScenario(){
    realtime('NSR:Quay:73576', '2022-09-27T11:33:32.003Z')
    realtimeCopy('NSR:Quay:73576', '2022-09-27T11:33:32.003Z')
}

//Performance scenario with different patterns
export function departuresScenarioPerformance(){
    let rand = Math.random()

    // 20 %
    if (rand < 0.2){
        for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++){
            realtime()
            sleep(1)
        }
    }
    // 30 %
    else if (rand >= 0.2 && rand < 0.5){
        for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++){
            realtime()
            sleep(1)
        }
    }
    // 50 %
    else {
        //0. find recent tickets
        realtime()
        sleep(1)
    }
}