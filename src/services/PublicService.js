/* eslint-disabled */
import Util from '../utils/Util';
import request from '../utils/request';
import {ListView} from 'antd-mobile';
import {Toast} from 'antd-mobile/lib/index';


function compress(source_img_obj, quality, output_format) {
  let mime_type = 'image/png';
  let cvs = document.createElement('canvas');
  cvs.width = 400;
  cvs.height = 400;
  cvs.getContext('2d').drawImage(source_img_obj, 0, 0, 400, 400 * source_img_obj.height / source_img_obj.width);
  let newImageData = cvs.toDataURL(mime_type, quality / 100);
  return {
    'newImageData': newImageData
  };
}

export default class PublicService {

  /**
   * 获取所有项目信息
   */
  static async getAllPublicInfo() {
    let {ret} = await request({url: '/projectEnginee/findAllProjectName', method: 'GET'});
    return ret;
  }

  /**
   * 获取部门人员树
   */
  static async loadDeptUserTree() {
    let {ret} = await request({url: '/personnelLibrary/loadDeptUserTree', method: 'GET'});
    return ret;
  }

  /**
   * 获取大区负责人
   */
  static async getRegionalManagerList() {
    //let {ret} = await request({url: '/user/getRegionalManagerList', method: 'GET'});
    let {ret} = await request({url: '/projectEnginee/loadRegionalManager', method: 'GET'});
    return ret;
  }

  /**
   * @param allProjectInfo 所有项目信息数组
   * @param valueIndex select option的value
   * @param textIndex select option的text
   * @param addAll 添加option {value: '', text: '全部'}
   * @returns {Array} 根据需要生成的select option配置
   */
  static transformProjectInfoToSelect(allProjectInfo, valueIndex, textIndex, addAll) {
    let selectOpts = [];
    if (allProjectInfo && allProjectInfo.length !== 0) {
      if (addAll) {
        selectOpts.push({value: '', text: '全部'});
      }
      for (let i = 0, l = allProjectInfo.length; i < l; i++) {
        selectOpts.push({
          value: allProjectInfo[i][valueIndex],
          text: allProjectInfo[i][textIndex]
        });
      }
    }
    return selectOpts;
  }

  /**
   * @param data 需要转换结构的源数据
   * @param needColNum 需要增加table序号列数据
   * @param needKey 需要增加唯一标识key
   * @param currentPage 当前页
   * @param pageSize 每页数据数目
   * @returns {*} 转换后的数据
   */
  static transformArrayData(data, needColNum, needKey, currentPage, pageSize) {
    // 需要添加table序号
    if (needColNum) {
      for (let i = 0; i < data.length; i++) {
        // 有分页
        if (currentPage && pageSize) {
          data[i]['num'] = pageSize * (currentPage - 1) + i + 1;
          // 无分页
        } else {
          data[i]['num'] = i + 1;
        }
      }
      // 需要添加唯一标识key
    }
    // 添加Key
    if (needKey) {
      for (let i = 0; i < data.length; i++) {
        // 若数据不存在key字段,则增加唯一标识key
        if (!data[i]['key']) data[i]['key'] = i;
      }
    }
    if (!needColNum && !needColNum) {
      console.info('检查transformArrayData方法参数(needColNum,needKey),返回数据结构未改变');
    }
    return data;
  }

  /**
   * 冒泡排序
   * @param arr 要排序的数据源
   * @param arrIndex 根据哪个字段排序
   */
  static arrSort(arr, arrIndex) {
    let len = arr.length;
    if (arrIndex) {
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j][arrIndex] > arr[j + 1][arrIndex]) {        // 相邻元素两两对比
            let temp = arr[j + 1];        // 元素交换
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    } else {
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    }
    return arr;
  }

  /**
   * @param data 需要转换结构的源数据
   * @param parentKey 父元素Key值
   * @param newKey 子元素key
   */
  static addKey(data, parentKey, newKey) {
    // 添加Key
    if (newKey) {
      for (let i = 0; i < data.length; i++) {
        // 增加唯一标识key
        data[i]['key'] = parentKey + i + '';
      }
    }
    return data;
  }

  /**
   * 传递moment对象数组转换为对象,
   * 0号位为开始时间(startTime),1号位为结果时间(endTime),
   */
  static transformDataToObj(dateArray, obj) {
    let dateObj = {};
    let defaultObj = {
      startTime: 'startTime',
      endTime: 'endTime',
      dateFormat: 'YYYY-MM-DD HH:MM:SS'
    };
    defaultObj = obj || defaultObj;
    dateObj = {
      [defaultObj.startTime]: dateArray[0].format(defaultObj.dateFormat),
      [defaultObj.endTime]: dateArray[1].format(defaultObj.dateFormat)
    };
    return dateObj;
  }

  /**
   * 删除的ids需要字符串带 , 号
   * 传递一个数组, 默认后台的字段为id
   */
  static transformArrayToString(dataArray, obj = {id: 'id'}) {
    let ids = [];
    dataArray.forEach((item, index) => {
      ids.push(item[obj.id]);
    });
    return ids.join(',');
  }

  /**
   * 删除的ids 需要传递的参数是数组
   * 传递一个数组, 默认后台的字段为id
   */
  static transformArrayToArray(dataArray, obj = {id: 'id'}) {
    let ids = [];
    dataArray.forEach((item, index) => {
      ids.push(item[obj.id]);
    });
    return ids;
  }

  /***
   * @columns 表格的columns属性
   * @returns {number} table宽度
   */
  static getTableWidth(columns) {
    let tableWidth = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].width) {
        tableWidth = tableWidth + parseInt(columns[i].width);
      } else {
        console.log('PublicService->getTableWidth: columns 中没有配置width属性');
      }
    }
    return tableWidth;
  }

  /**
   * @param params 导出文件所需参数
   * @returns {*}   返回导出拼接字符串
   */
  static paramSerializer(params) {
    if (!params) return '';
    let urlPart = [];
    for (let k in params) {
      let value = params[k];
      if (value === null || Util.isUndefined(value)) continue;
      if (Util.isArray(value)) {
        for (let i = 0, l = value.length; i < l; i++) {
          urlPart.push(k + '=' + value[i]);
        }
      } else {
        urlPart.push(k + '=' + value);
      }
    }
    return urlPart.join('&');
  }

  //去重算法
  static unique(a) {
    let ret = [];
    let hash = {};

    for (let i = 0, len = a.length; i < len; i++) {
      let item = a[i];

      let key = typeof (item) + item;

      if (hash[key] !== 1) {
        ret.push(item);
        hash[key] = 1;
      }
    }

    return ret;
  }

  /**
   * @param array为需要去重的数组 keys为指定的根据字段
   * @returns {Array} 返回筛选后的数组对象
   */
  static uniqeByKeys(array, keys) {
    let result = [], hash = {};
    for (let i = 0; i < array.length; i++) {
      let elem = array[i][keys];
      if (!hash[elem]) {
        result.push(array[i]);
        hash[elem] = true;
      }
    }
    return result;
  }

  /**
   * @param  e 为判断的对象
   * @returns 返回true 为空对象,返回false为不是空对象
   */
  static isEmptyObject(e) {
    let t;
    for (t in e) {
      return !1;
    }
    return !0;
  }


  // 浏览器全屏方法
  static fullScreen(element) {
    if (element.requestFullScreen) {
      element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }

  static transformArrayDataXNW(data, needColNum, currentPage, pageSize) {
    // 需要添加table序号
    if (needColNum) {
      for (let i = 0; i < data.length; i++) {
        // 有分页
        if (currentPage && pageSize) {
          data[i]['numXNW'] = pageSize * (currentPage - 1) + i + 1;
          // 无分页
        } else {
          data[i]['numXNW'] = i + 1;
        }
      }
    }
    return data;
  }

  /**
   * 保存字段到cookie
   * @param c_name 要保存字段的名称
   * @param value 要保存字段的值
   * @param expireDays 过期时间
   */
  static setCookie(c_name, value, expireDays = 30) {
    document.cookie = c_name + '=' + escape(value);
    // cookie过期时间
    // let timeCode = Date.now();
    // let expireTimeCode = timeCode + (60 * 60 * 24 * expireDays);
    // if (expireDays)
    //   document.cookie = 'expireTimeCode=' + expireTimeCode
  }

  /**
   * 从cookie中取字段
   * @param c_name 要取得的字段名
   * @returns {string} 返回字段对应的值, 若字段不存在则返回空
   */
  static getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + '=');
      if (c_start !== -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(';', c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return '';
  };

  /**
   * 清空cookie中某字段
   * @param name 要清空的字段名
   */
  static clearCookie(name) {
    this.setCookie(name, '', -1);
  }

  /**
   *
   * @param userId 用户登录ID
   * @param menuId 当前路由
   */
  static loadGngcButton(userId, menuId, projectModuleCode) {
    let result;
    return request({
      url: '/pms/loadGngcButtonByMenuId',
      method: 'GET',
      params: {
        userId, menuId, projectModuleCode
      }
    }).then(
      data => {
        console.log(data);
        return data.ret;
      }
    ).catch();
  }

  /**
   * 判断数组里是否有两个相同的数据
   * @param arr 需要做判断的数组
   * @return true 有重复的数据  false 没有重复的数据
   */
  static isRepeat(arr) {
    let hash = {};
    for (let i in arr) {
      if (hash[arr[i]]) {
        return true;
      }
      hash[arr[i]] = true;
    }
    return false;
  }

  static includesInArrayObj(array, key, value) {
    let returnBool = !1;
    for (let i = 0, j = array.length; i < j; i++) {
      if (array[i][key] === value) {
        returnBool = true;
        break;
      }
    }
    return returnBool;
  }

  // 年份选择
  static yearSelect() {
    let curYear = new Date().getFullYear();
    let yearSelectOpt = [];
    for (let i = curYear - 100; i < curYear + 100; i++) {
      yearSelectOpt.push({
        text: i,
        value: i,
      });
    }
    return yearSelectOpt;
  }

  /**
   * 实现对象的深克隆
   * obj 为需要克隆对象
   * **/
  static deepClone(obj) {
    if (typeof obj !== 'object') {
      return obj;
    }
    if (!obj) {
      return;
    }
    let newObj = obj.constructor === Array ? [] : {};  //开辟一块新的内存空间
    for (let i  in  obj) {
      newObj [i] = this.deepClone(obj [i]);                 //通过递归实现深层的复制
    }
    return newObj;
  }


  static genListViewDataSource(num, size) {
    const NUM_SECTIONS = num;
    const NUM_ROWS_PER_SECTION = size;
    const dataBlobs = {};
    let sectionIDs = [];
    let rowIDs = [];
    let pIndex = 0;
    for (let i = 0; i < NUM_SECTIONS; i++) {
      const ii = (pIndex * NUM_SECTIONS) + i;
      const sectionName = `Section ${ii}`;
      sectionIDs.push(sectionName);
      dataBlobs[sectionName] = sectionName;
      rowIDs[ii] = [];

      for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
        const rowName = `S${ii}, R${jj}`;
        rowIDs[ii].push(rowName);
        dataBlobs[rowName] = rowName;
      }
    }
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
    return {
      dataBlobs,
      sectionIDs,
      rowIDs
    };
  }

  static genDataSource(num, size) {
    let {sectionIDs, rowIDs, dataBlobs} = this.genListViewDataSource(num, size);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    return {
      dataSource: dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs)
    };
  }

  /*
  * 图片转为base64格式
  * file:
  * file.url 图片路径
  * file.raw.type 图片格式
  * callback 回调
  */
  static getImgBase64(file) {
    let t = this;
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      let imgUrlBase64 = reader.readAsDataURL(file);
      reader.onload = function (e) {
        let i = document.getElementById('test');
        i.src = reader.result;
        let quality = 70;
        i.onload = function () {
          let data_base64 = reader.result;
          // if (file.size > 1048500) {
          //   data_base64 = compress(i, quality).newImageData;
          // }
          resolve(data_base64);
        };
      };
    });

  }

  static add0(m) {
    return m < 10 ? '0' + m : m;
  }

  static formatTime(timestamp) {
    let time = timestamp ? new Date(timestamp) : new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  }

}
