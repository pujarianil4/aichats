import { useEffect, useRef, useState } from "react";
import "./profile.scss";
import { Button, Spin } from "antd";
import { FiEdit } from "react-icons/fi";
import { uploadSingleFile } from "../../services/api.ts";
import { updateUser, checkUserExist } from "../../services/userApi.ts";
import NotificationMessage from "../common/notificationMessage.tsx";
import Camera from "../../assets/camera.png";
import { useImageNameValidator } from "../../hooks/useImageNameValidator.tsx";
import SocialModal from "./socialModal.tsx";
import { useAppSelector } from "../../hooks/reduxHooks.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../../services/userApi.ts";

export default function UserProfile() {
  const queryClient = useQueryClient();
  const { isLoading, profile, error } = useAppSelector((state) => state.user);
  console.log("user", profile);
  const userId = profile?.uId;

  const {
    data: user,
    isLoading: loader,
    error: erring,
    refetch,
  } = useQuery({
    queryKey: ["privateuser", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {}, [refetch]);

  const [edit, setEdit] = useState<boolean>(false);
  const { validateImage } = useImageNameValidator();
  const fileRefs = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: user?.uName || "",
    email: user?.email || "",
    profilePic: user?.img?.pro || "",
  });

  useEffect(() => {
    setUserInfo({
      username: user?.uName || "",
      email: user?.email || "",
      profilePic: user?.img?.pro || "",
    });
  }, [user]);

  // Debounce Username Check
  useEffect(() => {
    if (
      !edit ||
      userInfo.username === user?.uName ||
      !userInfo.username.trim()
    ) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const response = await checkUserExist(userInfo.username);
        setUsernameAvailable(response.available);
      } catch (error) {
        setUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [userInfo.username, edit]);

  const handleInputChange = (key: string, value: string) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  };

  const uploadProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setImageUploading(true);
        const file = event.target.files[0];
        if (!validateImage(file)) return;
        const imgURL = await uploadSingleFile(file);
        handleInputChange("profilePic", imgURL);
        event.target.value = ""; // Reset input
      } catch (error) {
        setImageUploading(false);
        event.target.value = "";
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (usernameAvailable === false) {
      NotificationMessage("error", "Username is already taken.");
      return;
    }

    try {
      setLoading(true);
      const updatedData = {
        uName: userInfo.username,
        email: userInfo.email,
        img: { pro: userInfo.profilePic },
      };
      await updateUser(user.id, updatedData);
      NotificationMessage("success", "Profile Updated Successfully!");
      setEdit(false);
    } catch (error) {
      NotificationMessage("error", "Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='agent_container'>
      <div className='basic'>
        <div className='content'>
          <div className='tokenlogo'>
            {imageUploading ? (
              <Spin />
            ) : (
              <img
                onClick={() => fileRefs.current?.click()}
                src={userInfo.profilePic || Camera}
                alt='profile'
              />
            )}
            <input
              ref={fileRefs}
              onChange={uploadProfile}
              type='file'
              accept='image/png, image/jpeg, image/webp, image/jpg'
              style={{ visibility: "hidden", position: "absolute" }}
            />
          </div>
          <div className='info'>
            <h2>
              {userInfo.username}{" "}
              <span className='edit_btn' onClick={() => setEdit(!edit)}>
                <FiEdit /> Edit
              </span>
            </h2>
            <div className='social_tab'>
              <SocialModal user={user} type='user' />
            </div>
          </div>
        </div>
      </div>

      <div className='form'>
        <div className='input_container'>
          <label htmlFor='user_name'>User Name</label>
          <input
            id='user_name'
            value={userInfo.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            type='text'
            disabled={!edit}
          />
          {checkingUsername && <Spin size='small' />}
          {usernameAvailable === false && (
            <p style={{ color: "red" }}>Username is already taken</p>
          )}
        </div>

        <div className='input_container'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            value={userInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            type='text'
            disabled={!edit}
          />
        </div>

        {edit && (
          <Button onClick={handleSubmit} type='primary' loading={loading}>
            Update Profile
          </Button>
        )}
      </div>
    </div>
  );
}
