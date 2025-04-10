import {commentService} from "../../Service/CommentService";

export const commentBySlug = (slug) => async (dispatch) => {
    try {
        const res = await commentService.commentSlug(slug);
        console.log(res.data);
        if (res && res.data) {
            dispatch({
                type: "COMMENT_SLUG",
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
export const commentDetailSlug = (parentId) => async (dispatch) => {
    try {
        const res = await commentService.commentDetailSlug(parentId);
        console.log(res.data);
        if (res && res.data) {
            dispatch({
                type: "COMMENT_SLUG",
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

export const pushComment = (content,movieId,parentId,isShow) => async (dispatch) => {
    try {
        const res = await commentService.comment(content,movieId,parentId,isShow);
        if (res && res.data) {
            dispatch({
                type: "COMMENT",
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

export const totalComment = (movieId) => async (dispatch) => {
    try {
        const res = await commentService.totalComment(movieId);
        if (res && res.data) {
            dispatch({
                type: "TOTAL",
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