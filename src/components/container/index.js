import React,{Component} from 'react';
import {Button} from 'antd';
import './index.less';


class Container extends Component{


  render(){
    const {btnArray} = this.props;
    return(
      <div>
        <div className='my-btn-warp'>
          {
            btnArray.map((item,index) =>{
              return(
                <Button type='primary' size='small' key={index} {...item}>{item.name}</Button>
              )
            })
          }
        </div>
        {this.props.children}
      </div>
    )
  }
}





export default Container;
