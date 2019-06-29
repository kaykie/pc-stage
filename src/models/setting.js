import api from '../services/service';
import {message} from 'antd';
import createHashHistory from 'history/createHashHistory'

const history = createHashHistory();

export default {

  namespace: 'set',

  state: {
    // 以下为文章管理处
    isLoading: false, // 文章列表
    settingValues: {}
  },


  effects: {

    * getInitSetting({payload}, {put, call}) {
      try {
        const res = yield call(api.getSetting);
        console.log(res);
        yield put({type:'save',payload:{settingValues:res.data[0]}})
      } catch (e) {
        console.log(e)
      }

    },

    * saveSetting({payload}, {put, call, select}) {
      try {
        yield put({type: 'save', payload: {isLoading: true}});
        const res = yield call(api.updateSetting, payload.settingValues);
        yield put({type: 'resultHandle', payload: {res}});
      } catch (e) {
        console.log(e);
      }
    },


    * resultHandle({payload}, {put}) {
      const {res} = payload;
      if (res.code === '200') {
        message.success(res.msg);
        yield put({
          type: 'save', payload: {
            isLoading: false,
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
