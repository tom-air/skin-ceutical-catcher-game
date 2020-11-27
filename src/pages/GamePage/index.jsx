import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import Texture from '../../assets/2294472375_24a3b8ef46_o.jpg';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import './game.css';

const GamePage = () => {
  let camera, scene, renderer, controls, videoTexture, video;
  const screenRef = useRef(null);

  const animate = () => {
    window.requestAnimationFrame( animate );
    controls.update();
    // videoTexture = new THREE.VideoTexture(video);
    renderer.render( scene, camera );
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight )
  }

  const init3D = () => {
    console.log('initttt')
    video = document.getElementById('rear-video');
    video.play();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );

    scene = new THREE.Scene();
    controls = new DeviceOrientationControls( camera );

    const geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const mapTexture = new THREE.TextureLoader().load('/textures/2294472375_24a3b8ef46_o.jpg')
    console.log('>>>videoTexture>>', videoTexture)
    videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    const material = new THREE.MeshBasicMaterial( {
      map: videoTexture,
      // map: mapTexture,
    } );
    // const mesh = new THREE.Mesh( geometry );
    const mesh = new THREE.Mesh( geometry, material );
    // scene.background = videoTexture;
    scene.add( mesh );
    
    const helperGeometry = new THREE.BoxBufferGeometry( 100, 100, 100, 4, 4, 4 );
    const helperMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
    const helper = new THREE.Mesh( helperGeometry, helperMaterial );
    scene.add( helper );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    const screen = document.getElementById('screen-game');
    screen.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    initCameraStream();
  }

  const handleSuccess = (stream) => {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;

    const track = window.stream.getVideoTracks()[0];
    const settings = track.getSettings();
    // const str = JSON.stringify(settings, null, 4);
    console.log('settings ' + settings);
    // video = document.createElement('video');
    // const root = document.getElementById('root');
    // Object.assign(video, {
    //   ...video,
    //   srcObject: stream,
    //   width: settings.width,
    //   height: settings.height,
    //   autoplay: true,
    // });
    // root.append(video);

  }

  const initCameraStream = () => {
    // stop any active streams in the window
    // if (window.stream) {
    //   window.stream.getTracks().forEach(function (track) {
    //     console.log(track);
    //     track.stop();
    //   });
    // }
    // <video playsInline autoPlay id="rearVideo"></video>
    // video = document.getElementById('rear-video');


    const constraints = {
      audio: false,
      video: {
        width: window.innerWidth,
        height: window.innerHeight,
        facingMode: "environment",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch((error) => {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
      });
  }

  useEffect(() => {
    console.log('did mount')
    if (window.isAccessOrientationGranted) {
      console.log('did mount 2')
      init3D();
      animate();
    }
  }, [])

  return (
    <div id="screen-game" ref={screenRef}>
      Game Page
      <video id="rear-video" autoPlay playsInline></video>
    </div>
  );
}

export default GamePage;
