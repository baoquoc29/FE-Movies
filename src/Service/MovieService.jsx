import {baseService} from "./BaseService";

export class MovieService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    moviePopular = (page,size) => {
        const params = new URLSearchParams({
            page: page,
            size: size,
        }).toString();
        return this.get(`api/v1/movies/popular?${params}`,false);
    }
    movieNew = (page,size) => {
        const params = new URLSearchParams({
            page: page,
            size: size,
        }).toString();
        return this.get(`api/v1/movies/new?${params}`,false);
    }
    movieTopRate = (page,size) => {
        const params = new URLSearchParams({
            page: page,
            size: size,
        }).toString();
        return this.get(`api/v1/movies/topRate?${params}`,false);
    }
    movieDetail = (movieSlug) => {
        return this.get(`api/v1/movies/${movieSlug}`,false);
    };


}
export const movieService = new MovieService ();