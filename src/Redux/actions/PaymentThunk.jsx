import { paymentService } from "../../Service/PaymentService";

export const createUrlPay = (amount, orderInfo) => async (dispatch) => {
    try {
        const res = await paymentService.createUrlPay(amount, orderInfo);
        console.log(res);
        if (res && res.data) {
            const paymentUrl = res.data; // Lấy URL thanh toán từ API trả về

            // Kiểm tra và chuyển hướng nếu URL hợp lệ
            if (paymentUrl) {
                window.location.href = paymentUrl; // Chuyển hướng trình duyệt tới URL thanh toán
            }

            dispatch({
                type: "PAYMENT_URL_CREATED",
                payload: paymentUrl, // Lưu URL thanh toán vào state nếu cần
            });
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
        }
    } catch (error) {
        if (error.response) {
            // Nếu lỗi có response, log thông báo lỗi chi tiết
            console.log("Error during payment URL creation:", error.response.data.message);
        } else {
            // Nếu lỗi không có response (ví dụ lỗi mạng), log lỗi chung
            console.log("Error during payment URL creation:", error.message);
        }
    }
};

export const deposit = (username, amount) => async (dispatch) => {
    try {
        const res = await paymentService.deposit(username, amount);
        console.log(res.data); // Kiểm tra response ở đây

        // Kiểm tra xem có dữ liệu trong res.data hay không
        if (res && res.data && res.data.amount) {
            dispatch({
                type: "RESULT",
                payload: res.data, // Đảm bảo trả về dữ liệu có key 'amount'
            });
            return res.data; // Trả lại dữ liệu cho phần gọi useEffect
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};

export const buyVip = (username, duration) => async (dispatch) => {
    try {
        const res = await paymentService.buyVip(username, duration);
        console.log(res.data); // Kiểm tra response ở đây

        // Kiểm tra xem có dữ liệu trong res.data hay không
        if (res && res.data) {
            dispatch({
                type: "BUY_VIP",
                payload: res.data, // Đảm bảo trả về dữ liệu có key 'amount'
            });
            return res.data; // Trả lại dữ liệu cho phần gọi useEffect
        } else {
            console.log("Không có dữ liệu trả về từ API tạo URL thanh toán");
            throw new Error('Dữ liệu không hợp lệ');
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        throw error; // Truyền lỗi cho phần gọi useEffect
    }
};


