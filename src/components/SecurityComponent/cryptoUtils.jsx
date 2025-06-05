import CryptoJS from "crypto-js";

// Lấy secret key từ biến môi trường
const secretKey = process.env.REACT_APP_SECRET_KEY;

// Hàm mã hóa ID
export const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    return encodeURIComponent(encrypted); // Đảm bảo an toàn khi truyền qua URL
};

// Hàm giải mã ID
export const decryptId = (encryptedId) => {
    try {
        const decodedId = decodeURIComponent(encryptedId); // Giải mã URL
        const bytes = CryptoJS.AES.decrypt(decodedId, secretKey);
        const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedId) {
            throw new Error('Decryption failed');
        }

        return decryptedId;
    } catch (error) {
        console.error("Decryption failed:", error);
        return null; // Xử lý lỗi giải mã
    }
};
