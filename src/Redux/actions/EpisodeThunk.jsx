import {episodeService} from "../../Service/EpisodeService";

export const episodeSlug = (slug) => async (dispatch) => {
    try {
        const res = await episodeService.episodeDetail(slug);
        console.log(res.data);
        if (res && res.data) {
            dispatch({
                type: "DETAIL_EPISODE",
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
export const episode = (slug, ep) => async (dispatch) => {
    try {
        const res = await episodeService.episode(slug, ep);
        // Check if the response contains data
        if (res && res.data) {
            dispatch({
                type: "EPISODE_WATCHING",
                payload: res.data,
            });
            return res.data;
        } else {
            console.error("⚠️ No data returned from API");
            throw new Error('Dữ liệu không hợp lệ: Không có dữ liệu trả về từ API');
        }
    } catch (error) {
        console.error("❌ Error occurred while fetching episode details:", error);
        // It's a good practice to also dispatch an error state to Redux in case you want to show it in the UI
        dispatch({
            type: "FETCH_EPISODE_ERROR",
            payload: error.message,
        });
        throw error; // Rethrow the error so that the caller can handle it
    }
};
