import {baseService} from "./BaseService";

export class UserService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    register = (username,password,fullName,email,gender,dateOfBirth) => {
        return this.post('api/v1/auth/register',{username,email,password,fullName,gender,dateOfBirth})
    }
    login = (username,password) => {
        return this.post('api/v1/auth/login',{username,password})
    }
    changePassword = (currentPassword, newPassword,confirmPassword) => {
        return this.post('api/v1/auth/change-password',{currentPassword, newPassword,confirmPassword})
    }

    informationUser = (username) => {
        return this.get(`api/v1/auth/${username}`);
    }

}
export const userService = new UserService ();