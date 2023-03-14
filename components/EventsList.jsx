import {
  Badge,
  Button,
  Card,
  Empty,
  Image,
  Popover,
  QRCode,
  Segmented,
  Typography,
  message,
} from "antd";
import { ImQrcode } from "react-icons/im";
import { useState, useEffect } from "react";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {getStorage, ref, deleteObject} from 'firebase/storage'
import { useCollection } from "react-firebase-hooks/firestore";
import { app } from "../config/firebase.config";
import dayjs from "dayjs";
import Loading from "./Loading";
import { getAuth } from "firebase/auth";
import {useAuthState} from 'react-firebase-hooks/auth'


var itemData = [];
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);


const EventsList = () => {
  const [user] = useAuthState(auth);
  const [messageApi, contextHolder] = message.useMessage()
  const [EventList, setEventList] = useState([]);
  const collectionRef = collection(db, "events");

  const [value, loading] = useCollection(collectionRef);

  useEffect(() => {
    if (value) {
      var temp = [];
      value.docs.forEach((doc) => {
        temp.push(doc.data());
      });
      itemData = temp;
      setEventList(
        itemData.filter((item) => {
          return (
            dayjs(item.EventDate, "DD:MM:YYYY").format("DD:MM:YYYY") ===
            dayjs().format("DD:MM:YYYY")
          );
        })
      );
    }
  }, [value]);
  const { Text } = Typography;
  return (
    <>
      {contextHolder}
      <div className="h-full">
        <div className="flex  justify-center mt-2">
          <Segmented
            onChange={(e) => {
              if (e === "Today") {
                setEventList(
                  itemData.filter((item) => {
                    return (
                      dayjs(item.EventDate, "DD:MM:YYYY").format(
                        "DD:MM:YYYY"
                      ) === dayjs().format("DD:MM:YYYY")
                    );
                  })
                );
              } else if (e === "Upcoming") {
                setEventList(
                  itemData.filter((item) => {
                    return (
                      dayjs(item.EventDate, "DD:MM:YYYY").format("DD:MM:YYYY") >
                      dayjs().format("DD:MM:YYYY")
                    );
                  })
                );
              } else {
                setEventList(
                  itemData.filter((item) => {
                    return (
                      dayjs(item.EventDate, "DD:MM:YYYY").format("DD:MM:YYYY") <
                      dayjs().format("DD:MM:YYYY")
                    );
                  })
                );
              }
            }}
            options={["Previous", "Today", "Upcoming"]}
            defaultValue="Today"
          />
        </div>
        {loading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div>
            {value && EventList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                {EventList.map((item) => {
                  return (
                    <div key={Math.random()} className="m-4 inline-block ">
                      <Badge.Ribbon
                        text={`${dayjs(item.EventDate, "DD:MM:YYYY").format(
                          "dddd"
                        )} ${item.EventTime} `}
                        color="darkcyan"
                      >
                        <Card
                          style={{ width: 300 }}
                          cover={
                            <Image
                              className="w-full h-full"
                              src={item.UploadImage}
                            />
                          }
                          actions={[
                            <div
                              key="QRCode"
                              className="flex justify-center align-middle "
                            >
                              <Popover
                                content={
                                  <QRCode value={item.EventRegistrationLink} />
                                }
                              >
                                <ImQrcode className="relative top-2" />
                              </Popover>{" "}
                            </div>,
                            <div key="Apply">
                              <Button
                                href={item.EventRegistrationLink}
                                target="_blank"
                                type="link"
                              >
                                Apply
                              </Button>
                            </div>,
                            <div key="Delete">
                              <Button
                                type="link"
                                disabled={user && user.email === item.postingEmail ? false : true }
                                onClick={() => {
                                  messageApi.loading({
                                    content: "Deleting",
                                    key: "delete",
                                    type: "loading",
                                    duration: 0,
                                  });
                                  const q = query(
                                    collectionRef,
                                    where(
                                      "imageId",
                                      "==",
                                      item.imageId
                                    )
                                  );
                                  getDocs(q).then((doc) => {
                                    if (doc) {                          
                                        doc.docs.map((doc) =>
                                          deleteDoc(doc.ref).then(()=>{
                                            deleteObject(ref(storage, `images/${item.imageId}`)).then(()=>{
                                              messageApi.destroy("delete")
                                            })
                                          })
                                        )
                                    }
                                  });
                                }}
                                danger={true}
                              >
                                Delete
                              </Button>
                            </div>,
                          ]}
                        >
                          <div className="flex flex-col">
                            <Text className="text-xl  text-center  font-bold">
                              {item.EventName}
                            </Text>
                            <Text className=" text-left mb-1 mt-1  ">
                            {item.EventDescription && item.EventDescription.split('\n').map((line, i) => <div key={i}>{line}<br /></div>)}
                            </Text>
                            <Text className="font-bold">Venue: <span className="font-normal">{item.EventVenue}</span> </Text>
                            <Text className="font-bold">Date: <span className="font-normal">{item.EventDate}</span></Text>
                            <Text
                              copyable={{
                                text: item.Contact1,
                              }}
                            >
                              <span className="font-bold">Contact 1:</span> {item.Contact1}
                            </Text>
                            <Text
                              copyable={{
                                text: item.Contact2,
                              }}
                            >
                              <span className="font-bold">Contact 2:</span>  {item.Contact2}
                            </Text>
                            {/* <Text 
                       copyable={{
                        text: item.EventRegistrationLink,
                      }}
                      >Link: {item.EventRegistrationLink}</Text> */}
                          </div>
                        </Card>
                      </Badge.Ribbon>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center ">
                <Empty
                  className="relative top-10"
                  description={<Text className="font-bold ">No Events</Text>}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;
