import {baseService} from "./BaseService";

export class EpisodeService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    episodeDetail = (movieSlug) => {
        return this.get(`api/v1/episodes/${movieSlug}`,false);
    };
    episode = (slug,episodeNumber) => {
        return this.get(`api/v1/episodes/direct/${slug}/${episodeNumber}`,false);
    };
    createEpisode = (data) => {
        return this.post(`api/v1/episodes/create`,data);
    };
    updateEpisode = (episodeId, data) => {
        return this.put(`api/v1/episodes/update/${episodeId}`,data);
    };
    deleteEpisode = (episodeId) => {
        return this.delete(`api/v1/episodes/delete/${episodeId}`);
    }
}
export const episodeService = new EpisodeService ();