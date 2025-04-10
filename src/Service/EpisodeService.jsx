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

}
export const episodeService = new EpisodeService ();