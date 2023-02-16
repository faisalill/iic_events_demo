import { Typography, Layout } from "antd";
import Login from "./Login";

const Navbar = () => {
  const { Header } = Layout;
    const {Text} = Typography;
    const LoginStyles = {
      justifyContent: "center",
      alignItems: "center",
      height: "2.5rem",
      width: "2.5rem",
      backgroundColor: "#000d19",
      border: "2px solid rgb(13 148 136)",   
  }
    
 
  return (
    <>
    <Header
            className="flex justify-center sm:justify-between place-items-center "
            style={{
              backgroundColor: "#000d19",
            }}
          >
            <img src="/logos/logo11.png" alt="image" height={40} width={190} className="hidden sm:inline-block"/>
            <Text className=" text-2xl sm:text-3xl relative sm:right-20" code>
              Events
            </Text>
            <Login styles={LoginStyles}/>
          </Header>
    </>
  )
}

export default Navbar