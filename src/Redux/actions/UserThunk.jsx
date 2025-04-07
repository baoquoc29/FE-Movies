import {userService} from "../../Service/UserService";
import {
    LOGIN_SUCCESS,
    TOKEN,
    USER_LOGIN
} from "../../Utils/Setting/Config";
import {paymentService} from "../../Service/PaymentService";


export const loginUser = (username, password) => async (dispatch) => {
    try {
        const res = await userService.login(username, password);
        console.log(res);
        if (res.data && res.data.accessToken) {
            const { accessToken, username } = res.data;  // Direct destructuring
            const userDetails = { username };
            console.log(userDetails);
            localStorage.setItem(TOKEN, accessToken);
            localStorage.setItem(USER_LOGIN, JSON.stringify(userDetails));

            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    userData: userDetails,
                    token: accessToken
                }
            });
        } else {
            console.log("Login failed, no token returned");
        }
    } catch (error) {
        // Ensure we handle cases where `error.response` might be undefined
        const errorMessage = error.response ? error.response.data.message : "An unknown error occurred during login";
        console.log("Error during login:", errorMessage);
    }
};
export const changePassword = (current, newPassword,confirmPassword) => async (dispatch) => {
    try {
        const res = await userService.changePassword(current, newPassword,confirmPassword);

        if (res && res.data) {
            dispatch({
                type: "ChangePassword",
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
