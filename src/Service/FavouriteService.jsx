import {baseService} from "./BaseService";

export class FavouriteService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    favorites = () => {
        return this.get('api/v1/favorites/movies')
    }
    pushFavorites = (movieId) => {
        return this.post(`api/v1/favorites/${movieId}`)
    }
    removeFavorites = (movieId) => {
        return this.delete(`api/v1/favorites/${movieId}`)
    }
    checkFavorites = (movieId) => {
        return this.get(`api/v1/favorites/check/${movieId}`)
    }
    movieFavoriteSearch = ({
                       keyword = '',
                       country = '',
                       releaseYear = '',
                       genre = '',
                       page = 1,
                       size = ''
                   } = {}) => {
        // Tạo object params với giá trị mặc định hợp lý
        const params = {
            ...(keyword && { keyword }),
            ...(country && { country }),
            ...(releaseYear && { releaseYear }),
            ...(genre && { genre }),
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

        return this.get(`api/v1/favorites/search?${queryParams.toString()}`);
    };

}
export const favouriteService = new FavouriteService ();