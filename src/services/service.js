import request from '../utils/request';
// import PublicService from './PublicService';

export default {
  // 获取文章列表页面
  getArticleList(params){
    return request({
      url: '/api/article/get',
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
}
