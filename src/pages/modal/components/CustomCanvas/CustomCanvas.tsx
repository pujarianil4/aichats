import { useEffect, useRef, useState } from "react";
import { Html, useFBX } from "@react-three/drei";
import { AnimationMixer, Group, Vector3 } from "three";
import "./index.scss";
import axios from "axios";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ModelChat from "../ModelChat/ModelChat.tsx";
import { API_HEADERS, FBXMAP } from "../../../../utils/contants.ts";
import { ICharacter, IMessage, IModel } from "../../../../utils/types.ts";

const CustomCanvas = ({
  model,
  animationPath,
  setAnimationPath,
  eventSource,
}: {
  model: Group;
  animationPath: string;
  setAnimationPath: React.Dispatch<React.SetStateAction<string>>;
  eventSource: any;
}) => {
  const groupRef = useRef<Group | null>(null);

  const position = new Vector3(0, -100, 0);
  const animation = useFBX(animationPath);

  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(
    null
  );
  const [characterLabel, setCharacterLabel] = useState("");
  const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const mixer = useRef<AnimationMixer | null>(null);
  const [isActionPlaying, setIsActionPlaying] = useState(false);
  const defaultAnimationPath = FBXMAP[0].path; // Define the default animation

  const getCharacterAndModel = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_MODAL_API_BASE_URL}/lists`,
        headers: API_HEADERS,
      });
      setSelectedCharacter(response.data.characters?.[0]);
      setSelectedModel(response.data.engines?.[4]);
    } catch (error) {
      console.error(error);
    }
  };

  const getMessages = async () => {
    try {
      if (selectedModel && selectedCharacter) {
        const response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_MODAL_API_BASE_URL}/messages`,
          data: JSON.stringify({
            character_id: selectedCharacter?.id,
            engine_id: selectedModel?.id,
          }),
          headers: API_HEADERS,
        });
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCharacterAndModel();
  }, []);

  useEffect(() => {
    getMessages();
  }, [selectedCharacter, selectedModel]);

  useEffect(() => {
    if (model && animation.animations.length > 0) {
      if (!mixer.current) {
        mixer.current = new AnimationMixer(model);
      }

      mixer.current.stopAllAction(); // Stop any previous animations
      const action = mixer.current.clipAction(animation.animations[0]);
      action.reset().play();

      if (animationPath !== defaultAnimationPath) {
        setIsActionPlaying(true);

        action.setLoop(THREE.LoopOnce, 1); // Play the action animation once
        action.clampWhenFinished = true; // Hold the last frame

        const onAnimationFinished = (event: any) => {
          if (event.action === action) {
            setIsActionPlaying(false);
            setAnimationPath(defaultAnimationPath); // Reset to default animation
            setCharacterLabel(""); // Reset character label
          }
        };

        mixer.current.addEventListener("finished", onAnimationFinished);

        // Cleanup listener when animationPath changes
        return () => {
          mixer.current?.removeEventListener("finished", onAnimationFinished);
        };
      } else {
        action.setLoop(THREE.LoopRepeat, Infinity); // Default animation loops forever
      }
    }
  }, [animationPath, model, animation]);

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  useEffect(() => {
    eventSource.addEventListener("user_response", (data: any) => {
      console.log(data);
      const parsedData = JSON.parse(data.data);
      let message: IMessage = { role: "user", content: parsedData?.content };
      setMessages((prev) => [...prev, message]);
    });

    eventSource.addEventListener("character_response", (data: any) => {
      console.log(data);
      const parsedData = JSON.parse(data.data);
      let message: IMessage = {
        role: "assistant",
        content: parsedData?.content,
      };
      setMessages((prev) => [...prev, message]);
      setCharacterLabel(parsedData?.content);
    });
  }, []);

  return (
    <group ref={groupRef} position={position} dispose={null}>
      <Html position={[0, 190, 0]} center>
        <div className={`text`}>
          {characterLabel.slice(0, 200) +
            (characterLabel.length > 200 ? "..." : "")}
        </div>
      </Html>
      {messages.length > 0 && (
        <Html position={[0, 50, 0]} center>
          <ModelChat
            messages={messages}
            selectedCharacter={selectedCharacter}
          />
        </Html>
      )}
      <group name='Scene' rotation={[0, 0, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
};
FBXMAP.map((fbx) => useFBX.preload(fbx.path));

export default CustomCanvas;
