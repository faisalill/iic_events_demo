import { Alert, Button, Input, Modal, message } from 'antd';
import React,{useState} from 'react'
import { IoPersonCircle } from 'react-icons/io5';
import { ClubInfo } from '@/public/ClubInfo';
import { getAuth } from 'firebase/auth';
import {app} from '../config/firebase.config'
import {useSignInWithGoogle, useAuthState, useSignOut} from 'react-firebase-hooks/auth'
const auth = getAuth(app);

const Login = (props) => {
  const [signOut] = useSignOut(auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [user] = useAuthState(auth);
  function loginCheck (user){
   if(user!==null && user!==undefined){
    for(const club of ClubInfo){
      if(club.ClubEmailID == user.email || club.ClubLeaderEmailId == user.email || club.SecondLeaderEmail == user.email){
        return true;
      }
    }
   }
  }
  
    
    const [modalOpen, setModalOpen] = useState(false);
    const [DisableLogin, setDisableLogin] = useState(true);
    

  return (
    <>  
    {contextHolder}
              <Button
                type='primary'
                shape="circle"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
                style={props.styles}
                className="hidden sm:flex"
              >
                {user !== null ? <Modal
                centered
                open={modalOpen}
                onCancel={(e)=>{
                  e.stopPropagation();
                  setModalOpen(false);
                }}
                footer={[
                  <Button key='signout'
                  
                  onClick={()=>{
                    signOut().then((res)=>{
                      setModalOpen(false);
                      messageApi.success('Signed Out Successfully');
                    })
                  }}
                  >Sign Out</Button>,
                ]}
                >
               <div>
               <div className='text-center font-bold text-xl'>Name: {user.displayName}</div>
                <div className='text-center font-bold text-xl'>Email: {user.email}</div>
               </div>
                </Modal> : 
                <Modal
                title="Sign In"
                centered
                open={modalOpen}
                footer={[
                  <Button key="submit" disabled={DisableLogin}
                  onClick={()=>{
                    signInWithGoogle().then((res)=>{
                    if(res){
                      for(const clubs of ClubInfo){
                        if(clubs.ClubEmailID == res.user.email || clubs.ClubLeaderEmailId == res.user.email || clubs.SecondLeaderEmail == res.user.email){
                          setModalOpen(false);
                          messageApi.success('Logged In Successfully');
                          return;
                        }
                     }
                     for(const clubs of ClubInfo){
                      if(clubs.ClubEmailID !== res.user.email || clubs.ClubLeaderEmailId !== res.user.email || clubs.SecondLeaderEmail !== res.user.email){
                        setModalOpen(false);
                        messageApi.error('This Email is not allowed to login');
                        signOut();
                        return;
                      }
                    }
                    }
                    })
                  }}
                  >
                    Login
                  </Button>,
                ]}
                // onOk={(e) => {
                //   e.stopPropagation();
                //   setModalOpen(false);
                // }}
                onCancel={(e) => {
                  e.stopPropagation();
                  setModalOpen(false);
                }}
              >
                <Alert
                  className=""
                  message="Note"
                  description="Only Select Club Emails are allowed to login and post events. Enter your email to check whether you are allowed to login or not."
                  type="warning"
                  showIcon
                />
                <div className="m-4">
                  <Input
                    placeholder="Enter Email...."
                    onChange={(e) => {
                    for(const club of ClubInfo){
                      if(club.ClubEmailID == e.target.value || club.ClubLeaderEmailId == e.target.value || club.SecondLeaderEmail == e.target.value){
                        setDisableLogin(false);
                      }
                    }
                    }}
                  />
                </div>
              </Modal>
                }
                <IoPersonCircle
                  size={30}
                  className="text-teal-500 group-hover:text-teal-50 ease-in-out delay-75"
                />
              </Button>
    </>
  )
}

export default Login