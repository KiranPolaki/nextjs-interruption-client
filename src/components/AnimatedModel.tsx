"use client"; // for Next.js App Router if needed

import { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function AnimatedModel(props: any) {
  const { scene, animations } = useGLTF("/animations3.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    console.log("Scene children:", scene.children);

    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  return <primitive object={scene} {...props} />;
}

// Optional preloading
useGLTF.preload("/animations3.glb");
