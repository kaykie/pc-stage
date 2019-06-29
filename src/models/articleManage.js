import api from '../services/service';
import BraftEditor from 'braft-editor'
import {message} from 'antd';
import createHashHistory from 'history/createHashHistory'
const history = createHashHistory();

export default {

  namespace: 'article',

  state: {
    // 以下为文章管理处
    dataSource: [], // 文章列表
    pageSize: 10,
    pageNo: 1,
    loading: false,


    // 添加文章页面
    uniqueArticle: {},
    editorState: null,
    categoryList:[],
  },


  effects: {

    // 初始化文章列表页面数据
    * getInitData({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNo: 1}});
      // yield put({type: 'save', payload: {initLoading: true}});
      yield put({type: 'getArticle'});
      // yield put({type: 'save', payload: {initLoading: false}});
    },

    // 封装获取文章列表功能
    * getArticle({payload}, {select, call, put, take}) {
      try {
        yield put({type: 'save', payload: {loading: true}});
        const {pageNo, pageSize} = yield select(({article}) => article);
        const res = yield call(api.getArticleList, {pageNo, pageSize});
        console.log(res);
        yield put({type: 'save', payload: {loading: false, dataSource: res.data,total:res.page.total}})
      } catch (e) {
        console.log(e);
      }
    },

    // 改变页码
    * changePage({payload}, {take, call, put, select}) {
      let {pageNo} = payload;
      yield put({type:'save',payload:{pageNo}});
      yield put({type:'getArticle'});
    },

    // 删除文章
    * delArticle({payload}, {put, call, select}) {
      const {articleId} = payload;
      const res = yield call(api.delArticle,{articleId});
      yield put({type:'resultHandle',payload:{res}});
      yield put({type:'getInitData'})
    },

    // 通过文章id获取文章详情
    * getArticleDetail({payload}, {put, call, select}) {
      const {articleId} = payload;
      yield put({type:'getCategory'});
      const res = yield call(api.getArticleDetail, {articleId});
      console.log(res);
      yield put({
        type: 'save',
        payload: {uniqueArticle: res.data, editorState: BraftEditor.createEditorState(res.data.content)}
      });

    },

    // 添加文章与更新文章
    * addArticle({payload}, {put, call, select}) {
      try {
        let {params} = payload, {editorState,uniqueArticle} = yield select(({article}) => article);
        const content = editorState.toHTML();
        params.content = content;
        let res = {};
        if(uniqueArticle.content){
          params = {...uniqueArticle,...params};
          res = yield call(api.updateArticle,params)
        }else{
          res = yield call(api.addArticle, params, content)
        }
        yield put({type:'resultHandle',payload:{res}});
        history.replace('/article/articleManage')
      } catch (e) {
        console.log(e);
      }
    },

    // 获取所有的category
    *getCategory({payload},{put,call,select}){
      const res = yield call(api.getCategoryList);
      yield put({type:'save',payload:{categoryList:res.data}});
    },


    // 上传图片
    *uploadFile({payload},{put,call,select}){
      yield call(api.uploadImage,{file:payload.file})
    },


    * resultHandle({payload}, {put}) {
      const {res} = payload;
      if (res.code === '200') {
        message.success(res.msg);
        yield put({
          type: 'save', payload: {
            uniqueArticle: {},
            editorState:null
          }
        })
      }
    },

  },

  reducers: {
    save(state, {payload}) {
      console.log(payload);
      return {...state, ...payload};
    },
  },
  // subscriptions: {
  //   setup({dispatch, history}) {  // eslint-disable-line
  //   },
  // },
};
