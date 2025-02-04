import { Popover } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import React, { useState } from "react";
import { IoIosMore } from "react-icons/io";
import "./index.scss";
interface List {
  label: string;
  icon?: any;
}
interface IPopup {
  children: React.ReactNode;
  list: Array<List>;
  onAction?: "click" | "hover";
  position?: TooltipPlacement;
  onSelect: (label: string) => void;
  open?: boolean;
}

export default function CPopup({
  children,
  list,
  onAction = "click",
  position = "bottomRight",
  onSelect,
  open,
}: IPopup) {
  const handleSelect = (lbl: string) => {
    onSelect(lbl);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onSelect("");
  };
  const content = (
    <div className='cpopup_content'>
      {list?.map(({ icon: Icon, label }: List) => (
        <div onClick={() => handleSelect(label)} key={label} className='option'>
          {Icon && Icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
  return (
    <Popover
      placement={position}
      className='filter_popover'
      content={content}
      trigger={onAction}
      {...(open !== undefined && { open: open })}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
}
