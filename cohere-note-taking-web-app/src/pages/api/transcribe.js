const axios = require("axios");

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    Authorization: "c2a41970d9d811ec9d640242ac12",
    "Content-Type": "application/json",
  },
});

assembly
  .post("/transcript", {
    audio_url: "https://storage.googleapis.com/bucket/b2c31290d9d8.wav",
  })
  .then(parseResponse)
  .catch(console.error);
