import { RiMenuAddFill } from "react-icons/ri"
import PostEvent from "./PostEvent"
import Login from "./Login"
import { FloatButton } from "antd"

const FloatingButton = () => {
    const LoginStyles = {
        display: "flex",
         justifyContent: "center",
         alignItems: "center",
         height: "2.5rem",
         width: "2.5rem",
         margin: "1rem 0",
         // backgroundColor: "#000d19",
         // border: "2px solid rgb(13 148 136)",
         
       }
       
        const PostEventSmPlusStyle = {
         position: "fixed",
         right: "3rem",
         bottom: "3rem",
         height: "fit-content",
         width: "3rem",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
       }
        
       const PostEventSmMinusStyle = {
         position: "relative",
         left: '4px',
       }
  return (
    <>
    <div className="visible relative sm:hidden">
              <FloatButton.Group
              className="fixed bottom-20 left-10"
                trigger="click"
                
                style={{
                  right: 94,
                }}
                icon={<RiMenuAddFill />}
              >
                 <PostEvent styles={PostEventSmMinusStyle}/>
                 <Login styles={LoginStyles}/>
              </FloatButton.Group>
            </div>
    </>
  )
}

export default FloatingButton