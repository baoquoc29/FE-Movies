import {userService} from "../../Service/UserService";
import {
    LOGIN_SUCCESS,
    TOKEN,
    USER_LOGIN
} from "../../Utils/Setting/Config";


export const loginUser = (username, password) => async (dispatch) => {
    try {
        const response = await userService.login(username, password);
        const data = response?.data;

        if (data?.accessToken) {
            const { id, accessToken, username, fullName, balance, email, role, vipExpireDate } = data;
            const userDetails = { id, username, fullName, balance, email, vipExpireDate, role };

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
            console.log("Login failed: accessToken not found.");
        }
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "An unknown error occurred during login";
        console.error("Login Error:", errorMessage);
        // dispatch({ type: LOGIN_FAILURE, payload: errorMessage }); // optional
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
export const register = (username,password,fullName,email,gender,dateOfBirth) => async (dispatch) => {
    try {
        const res = await userService.register(username,password,fullName,email,gender,dateOfBirth);

        if (res && res.data) {
            dispatch({
                type: "Register",
                payload: res.data,
            });
            return res.data;
        } else {
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};

export const getUserByUsername = (username) => async (dispatch) => {
    try {
        const res = await userService.informationUser(username);

        if (res && res.data) {
            dispatch({
                type: "InfoUser",
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

export const getVip = (id) => async (dispatch) => {
    try {
        const res = await userService.getUserVip(id);

        if (res.code === 200) {
            dispatch({
                type: "VIP_STATUS",
                payload: res.data,
            });
            return res.data; // để component nhận được
        } else {
            console.warn("Không có dữ liệu trả về từ API");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi khi gọi API:", error);
        throw error;
    }
};
export const sendEmailForgot = (email) => async (dispatch) => {
    try {
        const res = await userService.sendResetPassword(email);

        if (res) {
            dispatch({
                type: "SEND_EMAIL",
                payload: res.code,
            });
            return res.code;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};
export const resetPassword = (body) => async (dispatch) => {
    try {
        const res = await userService.resetPassword(body);

        if (res) {
            dispatch({
                type: "RESET_PASSWORD",
                payload: res.code,
            });
            return res.code;
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};