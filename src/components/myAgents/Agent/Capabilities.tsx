import React from "react";
import "./capabilities.scss";
import { IoIosGlobe } from "react-icons/io";

import { IoDocumentTextOutline } from "react-icons/io5";

export default function Capabilities() {
  return (
    <div className='cap_container'>
      <div className='cap_header'>
        <div className='item'>
          <IoDocumentTextOutline size={20} />
          <p>Authenticate User</p>
        </div>
        <div className='item'>
          <IoDocumentTextOutline size={20} />
          <p>Get Ticket</p>
        </div>
        <div className='item'>
          <IoDocumentTextOutline size={20} />
          <p>Search Knowledge</p>
        </div>
      </div>
    </div>
  );
}
