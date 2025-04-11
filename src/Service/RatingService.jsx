import {baseService} from "./BaseService";

export class RatingService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    getStatusRating = (movieId) => {
        return this.get(`api/v1/rating/check/${movieId}`)
    }
    addRating = (movieId, rating,description) => {
        return this.post(`api/v1/rating/create/${movieId}`, {rating,description});
    }

}
export const ratingService = new RatingService ();