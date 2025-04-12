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

    movieSearch = ({
                       keyword = '',
                       country = '',
                       releaseYear = '',
                       genreId = '',
                       page = 1,
                       size = ''
                   } = {}) => {
        // Tạo object params với giá trị mặc định hợp lý
        const params = {
            ...(keyword && { keyword }),
            ...(country && { country }),
            ...(releaseYear && { releaseYear }),
            ...(genreId && { genreId }),
            page,
            size
        };

        // Chuyển thành URLSearchParams và tự động loại bỏ các giá trị rỗng
        const queryParams = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        }

        return this.get(`api/v1/movies/search?${queryParams.toString()}`, false);
    };

    getAllGenres = () => {
        return this.get(`api/v1/genres`,false);
    }

    getAllCountry = () => {
        return this.get(`api/v1/movies/country`,false);
    }

    getAllReleaseYear = () => {
        return this.get(`api/v1/movies/releaseYear`,false);
    }

    getAllActor = ({
                       page = 1,
                       size = ''
                   } = {}) => {
        const params = {
            page,
            size
        };

        // Chuyển thành URLSearchParams và tự động loại bỏ các giá trị rỗng
        const queryParams = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        }
        return this.get(`api/v1/movies/actors?${queryParams.toString()}`,false);
    }
    getAllMovieByActor = (actorId) => {
        return this.get(`api/v1/movies/find/${actorId}`,false);
    }
    getActorByActorId = (actorId) => {
        return this.get(`api/v1/movies/actors/${actorId}`,false);
    }

}
export const movieService = new MovieService ();