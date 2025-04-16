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

    getAllGenres = (page, size) => {
        const params = new URLSearchParams({
            page: page,
            size: size,
        }).toString();
        return this.get(`api/v1/genres?${params}`,false);
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

    getMoviePropose = (genreId,movieId) => {
        return this.get(`api/v1/movies/propose/${genreId}/${movieId}`,false);
    }

    adminGetAllMovie = (params) => {
        const filteredParams = new URLSearchParams();

        for (const [key, value] of (params || new URLSearchParams()).entries()) {
            if (value !== null && value !== undefined && value !== '') {
                filteredParams.append(key, value);
            }
        }

        console.log(filteredParams.toString()); // In ra chuỗi query đúng

        return this.get(`api/v1/movies/all?${filteredParams.toString()}`, true);
    }
    getAllActorNoPage = () => {
        return this.get(`api/v1/movies/actors/all`, false);
    }
    createMovie = (request) =>{
        return this.post(`api/v1/movies/create`, request);
    }
    updateMovie = (id, request) =>{
        return this.put(`api/v1/movies/update/${id}`, request);
    }

    deleteMovie = (id) =>{
        return this.delete(`api/v1/movies/delete/${id}`);
    }
}
export const movieService = new MovieService ();