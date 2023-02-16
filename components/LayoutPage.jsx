import React from "react";
import {
  ConfigProvider,
  Layout,
  theme,
} from "antd";
import Navbar from "./Navbar";
import EventsList from "./EventsList";
import PostEvent from "./PostEvent";
import FloatingButton from "./FloatButton";
import { useState, createContext } from "react";
const {Content, Footer} = Layout;


const LayoutCheck = () => {

 const PostEventSmPlusStyle = {
  position: "fixed",
  right: "3rem",
  bottom: "3rem",
  height: "fit-content",
  width: "2.8rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}



  const {darkAlgorithm } = theme;
  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        <Layout className="site-layout">
          <Navbar />
          <Content
            style={{
              backgroundColor: "#001529",
            }}
          >
            <div className="flex justify-center">
            <EventsList />
            </div>
            <div className="hidden sm:flex">
              <PostEvent styles={PostEventSmPlusStyle}/>
            </div>
            <FloatingButton />
          </Content>
          <Footer
            className="text-center"
          >
            Events ©2023 Created by BMSCE IIC
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default LayoutCheck;