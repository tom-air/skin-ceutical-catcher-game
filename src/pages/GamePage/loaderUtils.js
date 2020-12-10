import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// const gltfLoader = new GLTFLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();

const ele1 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum1.png');
const ele2 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum2.png');
const ele3 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum3.png');
const ele4 = new THREE.TextureLoader().load('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum4.png');

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

const inc = Math.PI * (3 - Math.sqrt(5));
const getRandomPositionEvenly = (k, radius, howMany) => {
  const off = 2 / howMany;
  const vec3 = new THREE.Vector3();
  let y = k * off - 1 + off / 2;
  let r = Math.sqrt(1 - y * y);
  const phi = k * inc;
  let x = Math.cos(phi) * r;
  let z = (0, Math.sin(phi) * r);
  x *= radius;
  y *= radius;
  z *= radius;
  vec3.x = x;
  vec3.y = y;
  vec3.z = z;
  return vec3;
}

const elementsMap = [ele1, ele2, ele3, ele4];
const createGoldPicElements = (id, index) => {
  const randNum = index % 4;
  const element = elementsMap[randNum];

  const imgWidth = 155 / 100;
  const imgHeight = 155 / 100;
  
  const geometry = new THREE.PlaneGeometry( imgWidth, imgHeight );
  const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, map: element, alphaTest: 0.5 });
  // material.magFilter = THREE.NearestFilter;
  // material.minFilter = THREE.NearestFilter;
  
  const goldEl = new THREE.Mesh( geometry, material );
  const posVec = getRandomPositionEvenly(index, 5, 20);
  goldEl.position.set(posVec.x, posVec.y, posVec.z);
  goldEl.name = id;
  return goldEl;
}

export {
  // createGlbElement,
  createGoldPicElements,
}