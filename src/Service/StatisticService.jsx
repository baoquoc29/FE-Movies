import {baseService} from "./BaseService";

export class StatisticService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };

    getStatisticRevenue = () =>{
        return this.get('api/v1/statistics/revenue',true);
    }

    getStatisticPackage = () =>{
        return this.get('api/v1/statistics/package',true);
    }

    getStatisticTopMovie = () =>{
        return this.get('api/v1/statistics/movie',true);
    }
}
export const statisticService = new StatisticService ();