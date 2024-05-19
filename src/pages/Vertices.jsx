/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
// src/Vertices.jsx
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import "./style.css";

extend({ MeshLineGeometry, MeshLineMaterial });

function Controls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    return () => controls.dispose();
  }, [camera, gl]);
  return null;
}

function Line({ start, end }) {
  const ref = useRef();
  const points = new Float32Array([...start.toArray(), ...end.toArray()]);

  useFrame(() => {
    if (ref.current) {
      ref.current.material.uniforms.dashOffset.value -= 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <meshLineGeometry attach="geometry" points={points} />
      <meshLineMaterial
        attach="material"
        lineWidth={0.1}
        color="#ffffff"
        dashArray={0.1}
        dashRatio={0.9}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function Scene({ vertices }) {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {vertices.map((vertex, index) => (
        <mesh key={index} position={vertex}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color={0xffa500} />
        </mesh>
      ))}
      {vertices.length > 1 &&
        vertices
          .slice(1)
          .map((vertex, index) => (
            <Line key={index} start={vertices[index]} end={vertex} />
          ))}
      <Controls />
    </>
  );
}

export default function Vertices() {
  const [vertices, setVertices] = useState([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 2, 0),
    new THREE.Vector3(-2, 2, 0),
  ]);

  const addVertex = () => {
    const randomPosition = () => (Math.random() - 0.5) * 10;
    const vertex = new THREE.Vector3(
      randomPosition(),
      randomPosition(),
      randomPosition()
    );
    setVertices((prevVertices) => [...prevVertices, vertex]);
  };

  return (
    <>
      <div>
        <div id="loadingOverlay">
          <div id="loadingDiv">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FFFFFF50"
                strokeWidth="10"
              />
              <circle
                id="progress"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="11"
                strokeDasharray="0 283"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div id="popupMessage">
            <span id="loadingText"></span>
          </div>
        </div>
        <button id="addVertexButton" onClick={addVertex}>
          +
        </button>
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 90 }}>
        <color attach="background" args={["#101020"]} />
        <Scene vertices={vertices} />
      </Canvas>
    </>
  );
}
