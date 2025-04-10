import {baseService} from "./BaseService";

export class CommentService extends baseService {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    };
    commentSlug = (movieSlug) => {
        return this.get(`api/v1/comments/${movieSlug}`,false);
    };
    commentDetailSlug = (parentId) => {
        return this.get(`api/v1/comments/children/${parentId}`,false);
    };
    comment = (content,movieId,parentId,isShow) => {
        return this.post(`api/v1/comments/create`,{content,movieId,parentId,isShow});
    }
    totalComment = (movieId) => {
        return this.get(`api/v1/comments/total/${movieId}`,false);
    }

}
export const commentService = new CommentService ();