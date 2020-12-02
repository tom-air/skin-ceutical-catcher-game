import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const createGlbElement = (id) => {
  const randX = Math.random() * 20 - 10;
  const randY = Math.random() * 10 - 5;
  const randZ = Math.random() * -5 - 2;
  let element;
  let mesh;

  return new Promise((resolve, reject) => {
    const envMap = cubeTextureLoader
      .setPath( '/textures/' )
      .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );
    gltfLoader.load('/textures/ball.glb', (glb) => {
      element = glb.scene;
      console.log('>>>>>', element)
      element.traverse((node) => {
        if (node.isMesh) {
          mesh = node;
          // node.material.envMapIntensity = 1.5; // boombox seems too dark otherwise
        }
      } );

      mesh.material.envMap = envMap;
      mesh.material.morphTargets = true;
      mesh.scale.multiplyScalar(20 / 100);
      mesh.position.set(randX, randY, randZ);
      mesh.name = id;
      resolve(mesh);
    }, (xhr) => {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, (error) => {
      reject(error)
    });
  });
}

export {
  createGlbElement,
}