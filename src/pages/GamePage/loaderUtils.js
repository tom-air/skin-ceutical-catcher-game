import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader().setPath('/textures');

const createGoldElements = async (id) => {
  const randX = Math.random() * 20 - 10;
  const randY = Math.random() * 10 - 5;
  const randZ = Math.random() * -5 - 2;
  let element;

  gltfLoader.load('ball.glb', (glb) => {
    glb.position.set(randX, randY, randZ);
    glb.name = id;
    element = glb;
  }, (xhr) => {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	}, (error) => {
		console.log( 'An error happened' );
  });
  return element;
}

export {
  createGoldElements,
}