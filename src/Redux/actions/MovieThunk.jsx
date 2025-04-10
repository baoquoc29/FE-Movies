import {  movieService } from "../../Service/MovieService";

export const moviesPopular = (page, size) => async (dispatch) => {
    try {
        const res = await movieService.moviePopular(page, size);
        if (res && res.data && res.data.content) {
            dispatch({
                type: "POPULAR",
                payload: res.data.content,
            });
            return res.data;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error;
    }
};

export const moviesTopRated = (page, size) => async (dispatch) => {
    try {
        const res = await movieService.movieTopRate(page, size);
        if (res && res.data && res.data.content) {
            dispatch({
                type: "TOP_RATING",
                payload: res.data.content,
            });
            return res.data;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error;
    }
};

export const moviesNew = (page, size) => async (dispatch) => {
    try {
        const res = await movieService.movieNew(page, size);
        if (res && res.data && res.data.content) {
            dispatch({
                type: "TOP_RATING",
                payload: res.data.content,
            });
            return res.data;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error;
    }
};

export const moviesSlug = (slug) => async (dispatch) => {
    try {
        const res = await movieService.movieDetail(slug);
        console.log(res.data);
        if (res && res.data) {
            dispatch({
                type: "DETAIL_MOVIE",
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
