import api from '../services/service';
import {message} from 'antd';
import createHashHistory from 'history/createHashHistory'
const history = createHashHistory();

export default {

  namespace: 'app',

  state: {
    // 以下为文章管理处
    isLoading: false, // 文章列表

  },


  effects: {
    * login({payload}, {put, call, select}) {
      try {
        yield put({type:'save',payload:{isLoading:true}});
        const {params} = payload;
        const res = yield call(api.login,params);
        if(res.code === '200'){
          history.push('/article');
        }
        yield put({type:'save',payload:{isLoading:false}});

        console.log(res);
      }catch (e) {
        console.log(e);
      }
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

};
