import { useState } from "react";
import "./profile.scss";

import SocialModal from "./socialModal.tsx";
import { shortenAddress } from "../../utils/index.ts";
import CopyButton from "../common/copyButton.tsx";
import UpdateProfile from "./updateProfile.tsx";
import { FiEdit } from "react-icons/fi";

interface IProps {
  user: any;
}

export default function UserProfile({ user }: IProps) {
  const { data: userData, isLoading } = user;
  const [edit, setEdit] = useState<boolean>(false);

  // Create a single state for user data
  const [userInfo, setUserInfo] = useState<any>({
    name: userData?.name || "",
    username: userData?.userName || "",
    bio: userData?.bio || "",
    profilePic: userData?.pic || "",
    contractAddress: userData?.token?.tCAddress || "",
    tokenTicker: userData?.token?.tkr || "",
    discord: userData?.discord || "",
    telegram: userData?.telegram || "",
    x: userData?.x || "",
  });

  const onChange = (key: string | string[]) => {
    // console.log(key);
  };

  const changeEdit = () => {
    setEdit((prev) => !prev);
  };

  // Handle changes in the input fields
  const handleInputChange = (key: string, value: string) => {
    setUserInfo((prevInfo: any) => ({
      ...prevInfo,
      [key]: value, // Dynamically update the specific key
    }));
  };

  return (
    <>
      {edit ? (
        <UpdateProfile userData={userData} setIsEditing={setEdit} />
      ) : (
        <div className='agent_container'>
          <div className='basic'>
            <div className='content'>
              <div className='tokenlogo'>
                <img src={userInfo.profilePic} alt='' />
              </div>
              <div className='info'>
                <h2>
                  {userInfo.name} <span>@{userInfo.tokenTicker}</span>
                  <span className='edit_btn' onClick={changeEdit}>
                    <FiEdit /> Edit
                  </span>
                </h2>

                <div className='social_tab'>
                  <p>
                    <span>{shortenAddress(userInfo.contractAddress)}</span>
                    <CopyButton
                      text={userInfo.contractAddress}
                      className='copy-btn'
                    />
                  </p>
                  <SocialModal
                    discord={userInfo.discord}
                    telegram={userInfo.telegram}
                    x={userInfo.x}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='form'>
            <div className='input_container'>
              <label htmlFor='user_name'>
                User Name
                <span className='required'>*</span>
              </label>
              <input
                id='user_name'
                value={userInfo.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                type='text'
                placeholder='Add User Name'
              />
              <span className='errormsg'></span>
            </div>

            <div className='input_container'>
              <label htmlFor='bio'>
                User Biography
                <span className='required'>*</span>
              </label>
              <textarea
                value={userInfo.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={10}
                id='bio'
                placeholder='This is the short bio that will be shown at your users profile.'
              />
              {/* <span className='errormsg'>{errorMsg.desc}</span> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
