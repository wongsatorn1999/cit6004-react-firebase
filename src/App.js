import React, { useState } from "react";
import firebase from "firebase";
import { config } from "./firebase/config";
import Carouselitem from "./component/ContentCarousel";
import { Carousel, Jumbotron, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/app.css";
import ContentDisplay from "./component/ContentDisplay";
import Management from "./component/Management";
import Loading from './component/Loading'
const App = () => {
  const [content, setcontent] = useState([]);
  const [show, setshow] = useState(false);
  const [displayAll, setdisplayAll] = useState(false);

  React.useEffect(() => {
    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    query()
  },[]);

  const query = async () => {
    setcontent(null)
     const userRef = firebase.database().ref("history").orderByChild('status');
    let newQuery = [];
    await userRef.on("value", (snapshot) => {
      snapshot.forEach((data) => {
        const dataVal = data.val();
        const userRef2 = firebase.database().ref(`plants`).child(dataVal.code);
        let name = "";
        userRef2.on("value", (snapshot2) => {
          snapshot2.forEach((data2) => {
            name= data2.val();
          });
        });
        // console.log(newQuery2)
        newQuery.push({
          id: data.key,
          code: dataVal.code,
          name: name,
          date: dataVal.date,
          detail: dataVal.detail,
          status: dataVal.status,
        });
      });
      // console.log(newQuery)
      setcontent(newQuery);
    });

    // console.log(content)
  };

  return (
    <Jumbotron>
      {/* {AppCarousel(content)} */}
      <Management show={show} setshow={setshow} firebase={firebase} query={query}/>

        <h2 className="float-left">แปลงผัก</h2>
        
        <Button
          variant="outline-success"
          className="float-right"
          onClick={() => {setshow(true); query()}}
        >
          Add
        </Button>
        <Button
          variant="outline-info"
          className="float-right mr-2"
          onClick={() => {setdisplayAll(prev => !prev);}}
        >
          {!displayAll ? "show All" : " Close"}
        </Button>
        <hr className="bg-dark mt-5" />
      {!content || content.length === 0 ? (
        <Loading />
      ) : (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>รหัสพืช</th>
              <th>ชื่อพืช</th>
              <th>รายละเอียด</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {content && content.map(({code, name, date, detail, id,status}) => (
            <ContentDisplay
              key={id}
              id={id}
              date={date}
              code={code}
              name={name}
              detail={detail}
              firebase={firebase}
              query={query}
              status={status}
              displayAll={displayAll}
            />
            ))}
          </tbody>
        </Table>
      )}
    </Jumbotron>
  );
};

export default App;

const AppCarousel = (content) => {
  const [indControlledCarousel, setindControlledCarousel] = useState(0);
  const handleSelectControlledCarousel = (selectedIndex, e) => {
    setindControlledCarousel(selectedIndex);
  };
  return (
    <div className="invisible">
      <Carousel
        activeIndex={indControlledCarousel}
        onSelect={handleSelectControlledCarousel}
        fade={true}
      >
        {content &&
          content.map(({ id, code, name, date, detail }) => (
            <Carouselitem
              key={id}
              id={id}
              code={code}
              name={name}
              date={date}
              detail={detail}
            />
          ))}
      </Carousel>
    </div>
  );
};


