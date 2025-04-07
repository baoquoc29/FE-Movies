import {baseService} from "./BaseService";

export class UserService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    login = (username,password) => {
        return this.post('api/v1/auth/login',{username,password})
    }
    changePassword = (currentPassword, newPassword,confirmPassword) => {
        return this.post('api/v1/auth/change-password',{currentPassword, newPassword,confirmPassword})
    }
}
export const userService = new UserService ();