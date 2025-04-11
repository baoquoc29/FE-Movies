import {vipPackage} from "../../Service/VipPackage";

export const getVipPackages = () => async (dispatch) => {
    try {
        const res = await vipPackage.getVipPackages();

        if (res && res.data) {
            dispatch({
                type: "GETVIP_PACKAGES",
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