import React from 'react'

const Loading = () => {
  return (
    <>
    <div className='flex justify-center relative top-16'>
        {/* <Spin tip='Loading' size='large'>

        </Spin> */}      
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
    </>
  )
}

export default Loading