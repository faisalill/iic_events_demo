import { Alert, Button, Input, Modal, Tooltip } from 'antd';
import React,{useState} from 'react'
import { IoPersonCircle } from 'react-icons/io5';

const Login = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [DisableLogin, setDisableLogin] = useState(true);
    const emails = [
        "bmsce.ac.in",
        "bmsce.edu.in",
        "iic.bmsce.ac.in"
    ];
        
  return (
    <>
              <Button
                type='primary'
                shape="circle"
                onClick={() => {
                  setModalOpen(true);
                }}
                style={props.styles}
                className="hidden sm:flex"
              >
                <Modal
                  title="Sign In"
                  centered
                  open={modalOpen}
                  footer={[
                    <Button key="submit" disabled={DisableLogin}>
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
                        if (emails.includes(e.target.value)) {
                          setDisableLogin(false);
                        } else {
                          setDisableLogin(true);
                        }
                      }}
                    />
                  </div>
                </Modal>
                <IoPersonCircle
                  size={30}
                  className="text-teal-500 group-hover:text-teal-50 ease-in-out delay-75"
                />
              </Button>
    </>
  )
}

export default Login