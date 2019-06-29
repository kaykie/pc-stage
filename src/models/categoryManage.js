import api from '../services/service';
import {message} from 'antd';
import createHashHistory from 'history/createHashHistory'
import dayjs from 'dayjs';

const history = createHashHistory();

export default {

  namespace: 'category',

  state: {
    // 以下为文章管理处
    dataSource: [], // 文章列表
    pageSize: 10,
    pageNo: 1,
    isLoading: false,
    isAddVisible: false, // 添加目录模态框是否开启
    isAddLoading:false,
    categoryName: '', // 当前输入的文字
    uniqueCategory: {}, // 用来保存编辑目录时候的唯一值
  },


  effects: {
    * getInitData({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNo: 1}});
      // yield put({type: 'save', payload: {initLoading: true}});
      yield put({type: 'getCategory'});
      // yield put({type: 'save', payload: {initLoading: false}});
    },

    * getCategory({payload}, {put, call, select}) {
      try {
        yield put({type: 'save', payload: {isLoading: true}});
        const {pageNo, pageSize} = yield select(({category}) => category);
        const params = {pageSize, pageNo};
        const res = yield call(api.getCategoryList, params);
        yield put({type: 'save', payload: {dataSource: res.data, isLoading: false}});
      } catch (e) {
        console.log(e);
      }
    },

    // 改变页码
    * changePage({payload}, {take, call, put, select}) {
      let {pageNo} = payload;
      yield put({type:'save',payload:{pageNo}});
      yield put({type:'getCategory'});
    },

    // 保存目录
    * submit({payload}, {put, select, call}) {
      yield put({type:'save',payload:{isAddLoading:true}});
      const {categoryName, uniqueCategory} = yield select(({category}) => category);
      let params = {},res = {};
      if (uniqueCategory.id) {
        params = {...uniqueCategory, categoryName};
        res = yield call(api.updateCategory, params);
      } else {
        params = {categoryName, createTime: dayjs().format('YYYY-MM-DD HH:mm')};
        res = yield call(api.addCategory, params);

      }
      yield put({type: 'resultHandle', payload: {res}});
      yield put({type: 'getInitData'})
    },

    *delCategory({payload},{put,call,select}){
      const {category} = payload;
      const res = yield call(api.delCategory,{categoryId:category.id});
      yield put({type:'resultHandle',payload:{res}});
      yield put({type:'getInitData'})
    },




    * resultHandle({payload}, {put}) {
      const {res} = payload;
      if (res.code === '200') {
        message.success(res.msg);
        yield put({
          type: 'save', payload: {
            uniqueArticle: {},
            isAddVisible: false,
            isAddLoading:false
          }
        })
      } else {
        message.error(res.msg)
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
