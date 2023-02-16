import { Spin } from 'antd'
import React from 'react'

const Loading = () => {
  return (
    <>
    <div className='flex justify-center relative top-16'>
        <Spin tip='Loading' size='large'>

        </Spin>
    </div>
    </>
  )
}

export default Loading