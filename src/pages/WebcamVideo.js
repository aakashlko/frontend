import React, { useCallback, useRef, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import Webcam from "react-webcam";
import { useReactMediaRecorder } from "react-media-recorder";
import { insertData } from "../indexedDB/idbConfig";
import { v4 as uuid } from "uuid";

export default function WebcamVideo() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true });

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    startRecording();
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    stopRecording();
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleCaptureDownload = async () => {
    const pathName = "react-stream-capture.webm";
    try {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
      } else {
        const link = document.createElement("a");
        link.href = mediaBlobUrl;
        link.download = pathName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const saveWebcamCapture = async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const recId = uuid().slice(0, 8);
      await insertData({ recId: recId, blob });
    }
  };

  const saveScreenCapture = async () => {
    const blob = new Blob([mediaBlobUrl], { type: "video/webm" });
    const recId = uuid().slice(0, 8);
    await insertData({ recId: recId, blob });
  };

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  return (
    <Container fluid className="p-6 mt-6">
      <Stack gap={4}>
        <div className="p-2" style={{ textAlign: "center" }}>
          <Webcam
            height={560}
            width={1380}
            audio={false}
            mirrored={true}
            ref={webcamRef}
            videoConstraints={videoConstraints}
          />
        </div>
        <div className="p-2" style={{ textAlign: "center" }}>
          {capturing ? (
            <Button
              variant="danger"
              onClick={() => {
                saveScreenCapture();
                saveWebcamCapture();
                handleStopCaptureClick();
              }}
            >
              Stop Recording
            </Button>
          ) : (
            <Button onClick={handleStartCaptureClick}>Start Recording</Button>
          )}
          {recordedChunks.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                handleDownload();
                handleCaptureDownload();
              }}
            >
              Save/Download
            </Button>
          )}
        </div>
      </Stack>
    </Container>
  );
}
