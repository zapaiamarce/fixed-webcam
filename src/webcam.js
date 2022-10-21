"use strict";

var remote = require("@electron/remote");

let videoSource = [];
let videoIndex = 0;
let videoSourceLength = 0;

remote.app.whenReady().then(() => {
  controls();
  webcamPrep();
});

function controls() {
  const close = document.querySelector("#closeButton");
  const theatre = document.querySelector("#theatreMode");
  const toggle = document.querySelector("#toggleVideoSource");
  const window = remote.getCurrentWindow();

  toggle.addEventListener("click", function (e) {
    videoIndex++;
    playVideo();
  });

  close.addEventListener("click", function (e) {
    window.close();
  });

  theatreMode.addEventListener("click", function (e) {
    var window = remote.getCurrentWindow();
    if (!window.isFullScreen()) {
      window.setResizable(true);
      window.setFullScreen(true);
    } else {
      window.setFullScreen(false);
      window.setResizable(false);
    }
  });
}

function webcamPrep() {
  //   navigator.mediaDevices.enumerateDevices().then(function (sources) {
  //     var videoSources = sources.filter(function (source) {
  //       return source.kind === "video";
  //     });
  //     console.log("got video sources", videoSources);
  //   });

  navigator.mediaDevices.enumerateDevices().then(function (sourceInfos) {
    console.log(sourceInfos);
    var tempVideoIndex = 0;

    for (let i = 0; i != sourceInfos.length; ++i) {
      //console.log(sourceInfos[i]);
      if (sourceInfos[i].kind === "videoinput") {
        //console.log('video source found: ', sourceInfos);
        videoSource[tempVideoIndex] = sourceInfos[i];
        videoSourceLength++;
        tempVideoIndex++;
      }
    }
    console.log(videoSource);
    playVideo();
  });
}

function errorCallback(err) {
  console.log("Rejected", err);
}

function successCallback(stream) {
  //   console.log(stream);

  const video = document.querySelector("#liveVideo");
  video.srcObject = stream;
}

function playVideo() {
  videoIndex = videoIndex % videoSourceLength;
  console.log("current video source :", videoSource[videoIndex]);
  const constraints = {
    audio: false,
    video: {
      width: { min: 1280 },
      height: { min: 720 },
      deviceId: videoSource[videoIndex].deviceId,
    },
  };

  navigator.mediaDevices.getUserMedia(constraints).then(successCallback);
}
