import React from "react";
import "./tabs.scss";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

type props = {
  items: TabsProps["items"];
};

export default function CustomTabs({ items }: props) {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div>
      <Tabs
        onChange={onChange}
        className='custom_tabs'
        type='card'
        items={items}
      />
    </div>
  );
}
