import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useCallback } from "react";
import { usePinch } from "@use-gesture/react";

export const CsOrbitControls = () => {
  const controls = useRef(null);
  const { gl } = useThree();

  const mapDistanceToTargetY = (
    distance,
    minDist = 1,
    maxDist = 150, // Updated to allow a larger range for zoom
    minY = 0.7,
    maxY = 0
  ) => {
    const normalizedDistance = (distance - minDist) / (maxDist - minDist);
    return minY + normalizedDistance * (maxY - minY);
  };

  const onChange = useCallback(
    (distance, target) => {
      target.y = mapDistanceToTargetY(distance);
      controls.current?.target.copy(target);
      controls.current.update();
    },
    [controls]
  );

  const onZoom = useCallback(() => {
    const { current: { object: { position }, target } = {} } = controls;
    const distance = position?.distanceTo(target);
    onChange(distance, target);
  }, [controls, onChange]);

  usePinch(onZoom, {
    target: gl.domElement,
    eventOptions: { passive: false },
  });

  useEffect(() => {
    gl.domElement.addEventListener("wheel", onZoom);
    return () => {
      gl?.domElement?.removeEventListener("wheel", onZoom);
    };
  }, [gl, onZoom]);

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      minDistance={0.1} // Allow closer zoom-in
      maxDistance={150} // Allow infinite zoom-out
      minPolarAngle={0} // Allow full upward rotation
      maxPolarAngle={Math.PI} // Allow full downward rotation
    />
  );
};
