import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { useLoader } from "@react-three/fiber";
import { ACTIONMAP, FBXMAP } from "../../utils/contants.ts";
import { CsOrbitControls } from "./components/CustomCanvas/Environment/CsOrbitControls.tsx";
import CustomCanvas from "./components/CustomCanvas/CustomCanvas.tsx";
import { Popover } from "antd";
import { FaChevronDown } from "react-icons/fa";
import "./index.scss";

const ModelPage = () => {
  const eventSource = new EventSource(
    import.meta.env.VITE_MODAL_BACKEND_SSE_URL
  );
  const [selectedAnim, setSelectedAnim] = useState(FBXMAP[0]);
  const [animationPath, setAnimationPath] = useState(selectedAnim.path);
  // const characterPath = "../../assets/fbx/model/character1.fbx";
  const characterPath = "/fbx/model/character1.fbx";
  console.log("CHARECTOR_PATH", characterPath);
  const character = useLoader(FBXLoader as any, characterPath); // Load character
  console.log("CHARACTER", character);

  const handleAnimSelectionChange = (option: any) => {
    const anim = FBXMAP.find((fbx: any) => fbx.path === option.path);
    if (anim) {
      setSelectedAnim(anim);
      setAnimationPath(anim.path);
    }
  };

  useEffect(() => {
    eventSource.addEventListener("action", (data) => {
      console.log("action", data);

      const parsedData = JSON.parse(data.data);
      const actions = ACTIONMAP.find(
        (action: any) => action.label === parsedData?.action
      );
      const array = actions?.path;
      if (array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        setAnimationPath(array[randomIndex]);
      }
    });
  }, []);

  const popoverContent = (
    <div className='popover_select'>
      {FBXMAP.map((option) => (
        <p
          className='select_item'
          key={option.label}
          onClick={() => handleAnimSelectionChange(option)}
        >
          {option.label}
        </p>
      ))}
    </div>
  );

  return (
    <div className={`base`}>
      <Canvas camera={{ fov: 100, position: [0, 200, 1000] }} className='z-10'>
        <ambientLight intensity={0.3} />
        <CsOrbitControls />
        {/* Pass character and animations */}
        <CustomCanvas
          model={character}
          animationPath={animationPath}
          setAnimationPath={setAnimationPath}
          eventSource={eventSource}
        />
      </Canvas>
      <div className={`model_footer`}>
        {/* <Select
          className='max-w-xs'
          items={FBXMAP}
          label='Animation'
          selectedKeys={[selectedAnim.path]}
          placeholder='Select an animation'
          onChange={handleAnimSelectionChange}
          classNames={{ popoverContent: styles.select_popover }}
        >
          {(fbx: any) => <SelectItem key={fbx.path}>{fbx.label}</SelectItem>}
        </Select> */}
        <Popover content={popoverContent} trigger='click'>
          <div className='select'>
            <p className='select_item'>
              {FBXMAP.find((option) => option.label === selectedAnim.label)
                ?.label || "Select an animation"}
            </p>
            <FaChevronDown />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default ModelPage;
