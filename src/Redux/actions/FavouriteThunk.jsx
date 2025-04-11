import {favouriteService} from "../../Service/FavouriteService";
import {movieService} from "../../Service/MovieService";

export const getFavourite = () => async (dispatch) => {
    try {
        const res = await favouriteService.favorites();

        if (res && res.data) {
            dispatch({
                type: "GET_FAVOURITE",
                payload: res.data,
            });
            return res.data;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};

export const removeFavourite = (movieId) => async (dispatch) => {
    try {
        const res = await favouriteService.removeFavorites(movieId);

        if (res && res.message) {
            dispatch({
                type: "REMOVE_FAVOURITE",
                payload: res.message,
            });
            return res.message;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};

export const pushFavourite = (movieId) => async (dispatch) => {
    try {
        const res = await favouriteService.pushFavorites(movieId);
        console.log(res.message);
        if (res && res.message) {
            dispatch({
                type: "PUSH_FAVOURITE",
                payload: res.message,
            });
            return res.message;
        } else {
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};

export const check = (movieId) => async (dispatch) => {
    try {
        const res = await favouriteService.checkFavorites(movieId);
        console.log(res.data);
        if (res && res.data) {
            dispatch({
                type: "PUSH_FAVOURITE",
                payload: res.data,
            });
            return res.data;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};

export const searchFavorite = (searchParams) => async (dispatch) => {
    try {
        const res = await favouriteService.movieFavoriteSearch(searchParams);
        console.log("searchParams:", searchParams);

        if (res && res.data) {
            dispatch({
                type: "FVR_SEARCH",
                payload: res.data,
            });
            return res.data;
        } else {
            console.log("Không có dữ liệu trả về từ API");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error;
    }
};