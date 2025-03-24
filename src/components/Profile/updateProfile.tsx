import React, { useEffect, useRef, useState } from "react";
import "./updateProfile.scss";
import { Button, Spin } from "antd";
import Camera from "../../assets/camera.png";
import { useImageNameValidator } from "../../hooks/useImageNameValidator.tsx";
import { uploadSingleFile } from "../../services/api.ts";
import NotificationMessage from "../common/notificationMessage.tsx";
import { updateUser } from "../../services/userApi.ts";
import { IoArrowBack } from "react-icons/io5";
export const IMAGE_FILE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";

type FormData = {
  username: string;
  email: string;
  profile: string;
  cover: string;
};

export default function UpdateAgent({
  userData,
  setIsEditing,
}: {
  userData: any;
  setIsEditing: (val: boolean) => void;
}) {
  const { validateImage, error: err } = useImageNameValidator();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    name: "",
    email: "",
  });
  const fileRefs = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    profile: "",
    cover: "",
  });
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (userData) {
      const initial = {
        username: userData.uName || null,
        email: userData.email || null,
        profile: userData.img?.pro || null,
        cover: userData.img?.cvr || null,
      };
      setFormData(initial);
      setInitialData(initial);
    }
  }, [userData]);

  const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("error", e);
    e.currentTarget.src = Camera;
  };

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const uploadProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setImageUploading(true);
        const file = event.target.files[0];
        if (!validateImage(file)) {
          return;
        }
        const imgURL = await uploadSingleFile(file);
        console.log("image", imgURL);
        handleInputChange("profile", imgURL);

        //reset value to select same image again
        event.target.value = "";
      } catch (error) {
        setImageUploading(false);
        event.target.value = "";
      } finally {
        setImageUploading(false);
      }
    }
  };

  const formValidation = () => {
    const { username, email } = formData;

    const validations = [
      {
        condition: () => {
          const charLength = String(username).split("").length;
          return charLength >= 3 && charLength <= 30;
        },
        field: "username",
        errorMsg:
          "Name must be between 3 and 30 characters (excluding spaces).",
      },
    ];

    let isValidate = true;

    validations.forEach(({ condition, field, errorMsg }) => {
      console.log("!condition()", field, !condition());

      if (!condition()) {
        setErrorMsg((prev) => ({ ...prev, [field]: errorMsg }));
        isValidate = false;
      } else {
        setErrorMsg((prev) => ({ ...prev, [field]: "" }));
      }
    });

    return isValidate;
  };

  const handleSubmit = async () => {
    console.log("Submitting Form Data:", formData);
    if (!formValidation()) return;
    if (!hasChanged) return;
    try {
      setLoading(true);
      const updatedData = {
        uName: formData.username || userData.name,
        img: {
          pro: formData.profile,
        },
        email: formData.email || userData.email,
      };
      console.log("sendData", updatedData);
      const response = await updateUser(userData.id, updatedData);
      if (response) {
        NotificationMessage("success", "Profile Updated Successfully!");
      }
    } catch (error) {
      console.error(error);
      NotificationMessage("error", "Failed to Update Agent. Try Again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='update_agent_container'>
      <div className='update_title'>
        <span className='back_button' onClick={() => setIsEditing(false)}>
          <IoArrowBack />
        </span>
        <span className='heading'>Update Profile</span>
      </div>
      <div className='form'>
        <div className='profile'>
          <h4>Profile Details</h4>
          <div>
            {imageUploading ? (
              <Spin />
            ) : (
              <img
                onClick={() => fileRefs.current?.click()}
                src={formData.profile || Camera}
                onError={setFallbackURL}
                alt='profile'
              />
            )}
            <input
              ref={fileRefs}
              onChange={uploadProfile}
              type='file'
              accept={IMAGE_FILE_TYPES}
              name='img'
              style={{ visibility: "hidden", position: "absolute" }}
            />
            <div>
              <p>Profile</p>
              <p className='pic'>
                Profile Picture <span className='required'>*</span>{" "}
              </p>
            </div>
          </div>
        </div>

        <div className='update_info'>
          <div className='input_container'>
            <label htmlFor='name'>
              User Name <span className='required'></span>{" "}
            </label>
            <input
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              id='name'
              type='text'
              placeholder='Agent Name'
            />
            <span className='errormsg'>{errorMsg.name}</span>
          </div>

          <div className='input_container'>
            <label htmlFor='name'>
              Email <span className='required'></span>{" "}
            </label>
            <input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              id='name'
              type='text'
              placeholder='Enter Your Email'
            />
            <span className='errormsg'>{errorMsg.email}</span>
          </div>

          <Button
            disabled={!hasChanged}
            // disabled={!isCreateAgentDisable || !hasChanged}
            onClick={handleSubmit}
            type='primary'
            loading={loading}
          >
            Update User
          </Button>
        </div>
      </div>
    </div>
  );
}
