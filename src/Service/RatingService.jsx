import {baseService} from "./BaseService";

export class RatingService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    register = () => {
        return this.post('api/v1/auth/register',)
    }
}
export const ratingService = new RatingService ();