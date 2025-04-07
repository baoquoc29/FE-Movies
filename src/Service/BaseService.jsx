import {DOMAIN, TOKEN} from "../Utils/Setting/Config";
import Axios from "axios";

export class baseService {
    put = (url, model) => {
        const token = localStorage.getItem(TOKEN);
        const config = {
            url: `${DOMAIN}/${url}`,
            method: 'PUT',
            data: model,
        };
        // Chỉ thêm Authorization nếu đã có token và url không bao gồm "login"
        if (token && !url.includes("login")) {
            config.headers = {
                'Authorization': `Bearer ${token}`
            };
        }
        return Axios(config).then(response => response.data).catch(error => { throw error });
    }

    post = (url, model) => {
        const token = localStorage.getItem(TOKEN);
        const config = {
            url: `${DOMAIN}/${url}`,
            method: 'POST',
            data: model,
        };
        // Chỉ thêm Authorization nếu đã có token và url không bao gồm "login"
        if (token && !url.includes("login")) {
            config.headers = {
                'Authorization': `Bearer ${token}`
            };
        }
        return Axios(config).then(response => response.data).catch(error => { throw error });
    }

    get = (url) => {

        const token = localStorage.getItem(TOKEN);
        console.log(token)
        const config = {
            url: `${DOMAIN}/${url}`,
            method: 'GET',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            }
        };
        return Axios(config).then(response => response.data).catch(error => { throw error });
    }

    delete = (url) => {
        const token = localStorage.getItem(TOKEN);
        const config = {
            url: `${DOMAIN}/${url}`,
            method: 'DELETE',
        };
        // Chỉ thêm Authorization nếu đã có token và url không bao gồm "login"
        if (token && !url.includes("login")) {
            config.headers = {
                'Authorization': `Bearer ${token}`
            };
        }
        return Axios(config).then(response => response.data).catch(error => { throw error });
    }
}
