import { Typography, Layout, Button, Drawer, Radio, Space } from "antd";
import { useState } from "react";
import Login from "./Login";
import { MenuOutlined } from "@ant-design/icons";
import { MdOutline10K } from "react-icons/md";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
  const { Header } = Layout;
  const { Text } = Typography;
  const LoginStyles = {
    justifyContent: "center",
    alignItems: "center",
    height: "2.5rem",
    width: "2.5rem",
    backgroundColor: "#000d19",
    border: "2px solid rgb(13 148 136)",
  };

  return (
    <>
      <Header
        className="flex justify-center sm:justify-between place-items-center "
        style={{
          backgroundColor: "#000d19",
        }}
      >
        <Button 
        className=""
          type="primary"
          icon={<MenuOutlined className=" relative bottom-[2px]" />}
          onClick={showDrawer}
          ></Button>
        <img
          src="/logos/logo11.png"
          alt="image"
          // height={40}
          // width={190}
          className="relative right-2 sm:right-0 scale-50"
        />
        <Login styles={LoginStyles} />
      </Header>
      <Drawer
        placement={placement}
        width={200}
        onClose={onClose}
        open={open}
      >
        
      </Drawer>
    </>
  );
};

export default Navbar;
