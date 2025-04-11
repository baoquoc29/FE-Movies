import {ratingService} from "../../Service/RatingService";
import {userService} from "../../Service/UserService";

export const getStatus = (movieId) => async (dispatch) => {
    try {
        const res = await ratingService.getStatusRating(movieId);

        if (res && res.message) {
            dispatch({
                type: "RatingStatus",
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

export const addRating = (movieId, rating,description) => async (dispatch) => {
    try {
        const res = await ratingService.addRating(movieId, rating,description);
        if (res && res.message) {
            dispatch({
                type: "ChangePassword",
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