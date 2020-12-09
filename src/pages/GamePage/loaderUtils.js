import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// const gltfLoader = new GLTFLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();

const ele1 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/1.png');
const ele2 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/2.png');
const ele3 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/8.png');
const ele4 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/4.png');
const ele5 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/5.png');
const ele6 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/10.png');
const ele7 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/7.png');
const ele8 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/11.png');
const ele9 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/12.png');

// const createGlbElement = (id) => {
//   const randX = Math.random() * 20 - 20;
//   const randY = Math.random() * 10 - 10;
//   const randZ = Math.random() * 10 - 10;
//   let element;
//   let mesh;

//   return new Promise((resolve, reject) => {
//     const envMap = cubeTextureLoader
//       .setPath( '/textures/' )
//       .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );
//     gltfLoader.load('/textures/ball.glb', (glb) => {
//       element = glb.scene;
//       element.traverse((node) => {
//         if (node.isMesh) {
//           mesh = node;
//           // node.material.envMapIntensity = 1.5; // boombox seems too dark otherwise
//         }
//       } );

//       mesh.material.envMap = envMap;
//       mesh.material.morphTargets = true;
//       mesh.scale.multiplyScalar(20 / 100);
//       mesh.position.set(randX, randY, randZ);
//       mesh.name = id;
//       resolve(mesh);
//     }, (xhr) => {
//       console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
//     }, (error) => {
//       reject(error)
//     });
//   });
// }

const elementsMap = [ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8, ele9];
const createGoldPicElements = (id) => {
  const randX = Math.random() * 16 - 8;
  const randY = Math.random() * 12 - 6;
  const randZ = Math.random() * 24 - 12;
  const randNum = Math.floor(Math.random() * 8);
  const element = elementsMap[randNum];

  const imgWidth = 105 / 100;
  const imgHeight = 105 / 100;
  
  const geometry = new THREE.PlaneGeometry( imgWidth, imgHeight );
  const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, map: element, alphaTest: 0.5 });
  // material.magFilter = THREE.NearestFilter;
  // material.minFilter = THREE.NearestFilter;
  
  const goldEl = new THREE.Mesh( geometry, material );
  goldEl.position.set(randX, randY, randZ);
  // goldEl.position.normalize();
  // goldEl.position.multiplyScalar(10);
  goldEl.name = id;
  return goldEl;
}

export {
  // createGlbElement,
  createGoldPicElements,
}