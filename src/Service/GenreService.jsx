import {baseService} from "./BaseService";

export class GenreService extends baseService {
    constructor() {
        super();
    }
    getAllGenres = (keyword, page,size) => {
        const params = new URLSearchParams({
            keyword: keyword,
            page: page,
            size: size,
        }).toString();
        return this.get(`api/v1/genres?${params}`, true);
    };
    createGenre = (genre) => {
        return this.post(`api/v1/genres/create`, genre);
    };

    updateGenre = (genre) => {
        return this.put(`api/v1/genres/update/${genre.id}`, genre);
    };
    deleteGenre = (id) => {
        return this.delete(`api/v1/genres/delete/${id}`);
    };
}
export const genreService = new GenreService();