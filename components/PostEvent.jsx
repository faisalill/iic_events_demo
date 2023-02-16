import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Tooltip,
  Popover,
  QRCode,
  Modal,
  Input,
  Typography,
  Upload,
  Image,
  TimePicker,
  DatePicker,
  Tag,
  Popconfirm,
  message,
} from "antd";
import {
  PlusCircleOutlined,
  UndoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsCalendar4Event, BsLink45Deg, BsTelephonePlus } from "react-icons/bs";
import { MdOutlinePlace } from "react-icons/md";
import { itemDataContext } from "@/pages";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {doc, setDoc, getFirestore} from 'firebase/firestore'
import {uuidv4} from '@firebase/util'
import { app } from "../config/firebase.config";


const storage = getStorage(app);
const db = getFirestore(app);
const docRef = doc(db, "events", uuidv4());

const schema = Yup.object().shape({
  EventName: Yup.string().required("Required"),
  EventVenue: Yup.string().required("Required"),
  Contact1: Yup.number()
    .min(1000000000, "Number is not 10 characters")
    .required("Required"),
  Contact2: Yup.number()
    .min(1000000000, "Number is not 10 characters")
    .required("Required"),
  EventRegistrationLink: Yup.string()
    .url("Enter a valid URL")
    .required("Required"),
});

const PostEvent = (props) => {
  const [messageApi, contextHolder] = message.useMessage()

  const [Percent, setPercent] = useState(0);
  const { itemData, setItemData } = useContext(itemDataContext);
  const formikSubmit = (e) => {
    handleUpload(e);
  };
  const formik = useFormik({
    initialValues: {
      EventName: "",
      EventVenue: "",
      Contact1: "",
      Contact2: "",
      EventRegistrationLink: "",
    },
    onSubmit: formikSubmit,
    validationSchema: schema,
  });

  function handleUpload(e) {
    if (UploadImage === null) {
      alert("Please upload an image");
    } else {
      
      const storageRef = ref(storage, `images/${UploadImage.uid}${UploadImage.lastModified}`);
      const uploadTask = uploadBytesResumable(storageRef, UploadImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          messageApi.open({
            content: `Uploading `,
            key: "uploading",
            duration: 0,
            type: 'loading',
          })
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            EventDetails = {
              ...formik.values,
              EventDate: EventDate,
              EventTime: EventTime,
              UploadImage: url,
              imageId: UploadImage.uid + UploadImage.lastModified,
            };
            setDoc(docRef, EventDetails).then(()=>{
            messageApi.destroy("uploading")
            formik.resetForm();
            setUploadImage(null);
            e.stopPropagation()
            setDisablePostModal(false);
            setPercent(0);
            })
            .catch((err) => 
            {
              console.log(err)
            }
            );
          });
        }
      );
    }
  }

  var EventDetails = {};
  const [EventRegistrationLink, setEventRegistrationLink] = useState(null);
  const [EventDate, setEventDate] = useState(null);
  const [EventTime, setEventTime] = useState(dayjs("12:00:am", "h:mm:a").format("h:mm a"));
  const firstEventTime = dayjs("12:00:am", "h:mm:a");
  const [UploadImage, setUploadImage] = useState(null);
  const [DisablePostModal, setDisablePostModal] = useState(false);
  const { Text } = Typography;

  return (
    <>
    {contextHolder}
      <Button
        onClick={(e) => {
          setDisablePostModal(true);
          e.stopPropagation();
        }}
        type="primary"
        shape="circle"
        style={props.styles}
        className="group"
        icon={
          <PlusCircleOutlined className="text-3xl place-self-center relative bottom-[1.5px] self-center text-teal-500 group-hover:text-white ease-in-out delay-75" />
        }
      >
        <Modal
          open={DisablePostModal}
          centered
          footer={[
            <Tooltip key="reset-tooltip" title="Reset" placement="top">
              {" "}
              <Button
                key="reset"
                onClick={() => {
                  formik.resetForm();
                  setUploadImage(null);
                  setEventTime(firstEventTime);
                }}
                className=""
              >
                <UndoOutlined className="relative bottom-1" />
              </Button>
            </Tooltip>,
            <Popconfirm
              title="Are you sure to upload this event?"
              description="Make sure all the details are correct."
              onConfirm={formikSubmit}
              key="popconfirm"
            >
              <Button
                key="Upload Event"
                className="m-1 mx-3 bg-blue-600"
                type="primary"
              >
                Upload
              </Button>
            </Popconfirm>,
          ]}
          onCancel={(e) => {
            e.stopPropagation();
            setDisablePostModal(false);
          }}
        >
          <div className="flex-col flex ">
            {/* <Typography strong className="text-center font-bold text-lg">Enter Event Details</Typography> */}
            <Text strong code className="text-center text-2xl m-2">
              Enter Event Details
            </Text>
            <Text className="text-center mt-4 m-1  font-semibold text-base">
              Event Name
            </Text>
            <Input
              autoComplete="off"
              value={formik.values.EventName}
              name="EventName"
              prefix={<BsCalendar4Event className="mr-2" />}
              onChange={
                //     (e) => {
                //     setEventName(e.target.value);
                //   }
                formik.handleChange
              }
              className="m-2"
              placeholder="Enter Event Name..."
            />
            {formik.errors.EventName ? (
              <Tag color="error" className="w-fit ml-2">
                {formik.errors.EventName}
              </Tag>
            ) : null}
            <Text className="text-center mt-4  font-semibold">Poster</Text>
            {UploadImage === null ? null : (
              <Image
                src={URL.createObjectURL(UploadImage)}
                alt="image"
                className="m-1"
              />
            )}

            <Upload
              accept="image"
              // fileList={UploadImage}
              onChange={(e) => {
                // console.log(e.fileList[0]);
                if (e.fileList[0]) {
                  setUploadImage(e.fileList[0].originFileObj);
                }
              }}
              maxCount={1}
              className="self-center mb-4 mt-2"
              onRemove={(e) => {
                setUploadImage(null);
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Poster</Button>
            </Upload>

            <Text className="text-center m-1 mt-4 font-semibold">Time</Text>
            <TimePicker
              className="mt-2 mb-4"
              onChange={(e) => {
                // setEventTime(dayjs(e))
                setEventTime(dayjs(e).format("h:mm:a"));

                // console.log(dayjs(e))
              }}
              defaultValue={firstEventTime}
              // value={new Date(EventTime)}
              format="h:mm:a"
            />
            <Text className="text-center m-1 font-semibold">Date</Text>
            <DatePicker
              className="mt-2 mb-4"
              format="DD/MM/YYYY"
              onChange={(e) => {
                setEventDate(dayjs(e).format("DD/MM/YYYY"));
              }}
            />
            <Text className="text-center mt-4 m-1  font-semibold text-base">
              Venue
            </Text>
            <Input
              autoComplete="off"
              value={formik.values.EventVenue}
              name="EventVenue"
              onChange={
                //     (e) => {
                //     setEventVenue(e.target.value);
                //   }
                formik.handleChange
              }
              className="m-2"
              placeholder="Enter Venue..."
              prefix={<MdOutlinePlace className="mr-2" />}
            />
            {formik.errors.EventVenue ? (
              <Tag color="error" className="w-fit ml-2">
                {formik.errors.EventVenue}
              </Tag>
            ) : null}

            <Text className="text-center mt-4 m-3  font-semibold text-base">
              Contacts
            </Text>
            <div className="flex gap-1">
              <Input
                autoComplete="off"
                value={formik.values.Contact1}
                name="Contact1"
                placeholder="Contact 1"
                type="number"
                prefix={<BsTelephonePlus className="mr-1" />}
                onChange={
                  //     (e) => {
                  //   setContact1(e.target.value);
                  // }
                  formik.handleChange
                }
              />
              <Input
                autoComplete="off"
                value={formik.values.Contact2}
                name="Contact2"
                placeholder="Contact 2"
                type="number"
                prefix={<BsTelephonePlus className="mr-1" />}
                onChange={
                  //     (e) => {
                  //   setContact2(e.target.value);
                  // }
                  formik.handleChange
                }
              />
            </div>
            {formik.errors.Contact1 || formik.errors.Contact2 ? (
              <Tag color="error" className="w-fit mt-2">
                Contact 1:{formik.errors.Contact1} | Contact 2:{" "}
                {formik.errors.Contact2}
              </Tag>
            ) : null}
            <Text className="text-center mt-8 m-2 font-semibold text-base">
              Registration Link / QR Code Link
            </Text>
            <Input
              autoComplete="off"
              value={formik.values.EventRegistrationLink}
              prefix={<BsLink45Deg className="mr-1" />}
              name="EventRegistrationLink"
              onChange={(e) => {
                setEventRegistrationLink(e.target.value);
                formik.handleChange(e);
              }}
              className="m-2"
              placeholder="Enter the link...."
            />
            {formik.errors.EventRegistrationLink ? (
              <Tag color="error" className="w-fit ml-2">
                {formik.errors.EventRegistrationLink}
              </Tag>
            ) : null}
            <Popover
              overlayInnerStyle={{ padding: 0 }}
              content={
                <QRCode
                  value={formik.values.EventRegistrationLink}
                  bordered={false}
                />
              }
            >
              {EventRegistrationLink === null ? null : (
                <Text className="text-center  font-semibold text-base" code>
                  Hover/Click to preview QR Code
                </Text>
              )}
            </Popover>
          </div>
        </Modal>
      </Button>
    </>
  );
};

export default PostEvent;
