import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import Container from "react-bootstrap/Container";
import { Row, Col, Button, Card } from "react-bootstrap";
import webcamScreen from "../Images/webcamScreen.jpg";

import { useReactMediaRecorder } from "react-media-recorder";

export default function Recorder() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:3001",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else
          toast(`Hi ${data.user} 🦄`, {
            theme: "dark",
          });
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
  };

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true });
  return (
    <Container className="mt-4">
      <Row>
        <Col></Col>
        <Col md="auto"></Col>
        <Col xs lg="2">
          <Button onClick={logOut} variant="secondary">
            Logout
          </Button>
        </Col>
      </Row>
      <Row className="mt-4 p-2">
        <Col>
          <Card className="text-center" style={{ width: "20rem" }}>
            <Card.Img variant="top" src={webcamScreen} />
            <Card.Body>
              <Card.Title>Capture Screen</Card.Title>
              {status === "recording" ? (
                <Button variant="danger" onClick={stopRecording}>
                  Stop Recording
                </Button>
              ) : (
                <Button onClick={startRecording}>Start Recording</Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center" style={{ width: "20rem" }}>
            <Card.Img variant="top" src={webcamScreen} />
            <Card.Body>
              <Card.Title>Record Webcam + Screen</Card.Title>
              <Button onClick={() => navigate("/recorder")}>
                Start Recording
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card
            className="text-center"
            style={{ objectFit: "contain", width: "20rem" }}
          >
            <Card.Img variant="top" src={webcamScreen} />
            <Card.Body>
              <Card.Title>Record Webcam</Card.Title>
              <Button>Start Recording</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}
