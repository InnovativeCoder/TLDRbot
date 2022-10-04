import MicRecorder from "mic-recorder-to-mp3";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Set AssemblyAI Axios Header
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "a8874d96b9824512a177ca5cc523bf24",
    "content-type": "application/json",
    "transfer-encoding": "chunked",
  },
});

const App = () => {
  // Mic-Recorder-To-MP3
  const recorder = useRef(null); //Recorder
  const audioPlayer = useRef(null); //Ref for the HTML Audio Tag
  const [blobURL, setBlobUrl] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(null);

  useEffect(() => {
    //Declares the recorder object and stores it inside of ref
    recorder.current = new MicRecorder({ bitRate: 128 });
  }, []);

  const startRecording = () => {
    // Check if recording isn't blocked by browser
    recorder.current.start().then(() => {
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    recorder.current
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, "audio.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });
        const newBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(newBlobUrl);
        setIsRecording(false);
        setAudioFile(file);
      })
      .catch((e) => console.log(e));
  };

  // AssemblyAI API

  // State variables
  const [uploadURL, setUploadURL] = useState("");
  const [transcriptID, setTranscriptID] = useState("");
  const [transcriptData, setTranscriptData] = useState("");
  const [transcript, setTranscript] = useState("");

  // Upload the Audio File and retrieve the Upload URL
  useEffect(() => {
    if (audioFile) {
      assembly
        .post("/upload", audioFile)
        .then((res) => setUploadURL(res.data.upload_url))
        .catch((err) => console.error(err));
    }
  }, [audioFile]);

  // Submit the Upload URL to AssemblyAI and retrieve the Transcript ID
  const submitTranscriptionHandler = () => {
    assembly
      .post("/transcript", {
        audio_url: uploadURL,
      })
      .then((res) => {
        setTranscriptID(res.data.id);
      })
      .catch((err) => console.error(err));
  };

  // Check the status of the Transcript and retrieve the Transcript Data
  const checkStatusHandler = async () => {
    try {
      await assembly.get(`/transcript/${transcriptID}`).then((res) => {
        setTranscriptData(res.data);
        setTranscript(transcriptData.text);
      });
    } catch (err) {
      console.error(err);
    }
  };

  console.log(transcriptData);

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
      <h1 className="text-3xl pb-3">Transcribe your lecture here !!</h1>
      <audio className="mb-3" ref={audioPlayer} src={blobURL} controls="controls" />
      <div>
        <button className="p-3 mr-3 rounded-sm bg-black text-white" disabled={isRecording} onClick={startRecording}>
          START
        </button>
        <button className="p-3 m-3 rounded-sm bg-black text-white" disabled={!isRecording} onClick={stopRecording}>
          STOP
        </button>
        <button className="p-3 m-3 rounded-sm bg-black text-white" onClick={submitTranscriptionHandler}>SUBMIT</button>
        <button className="p-3 m-3 rounded-sm bg-black text-white" onClick={checkStatusHandler}>CHECK STATUS</button>
      </div>
      {transcriptData.status === "completed" ? (
        <p>{transcriptData.text}</p>
      ) : (
        <p>{transcriptData.status}</p>
      )}
      </div>
    </div>
  );
};

export default App;
