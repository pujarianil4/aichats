import React from "react";
import "./tabs.scss";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

type Props = {
  items: TabsProps["items"];
  onChange: (key: string) => void;
  activeKey: string;
};

export default function CustomTabs({ items, onChange, activeKey }: Props) {
  return (
    <div>
      <Tabs
        onChange={onChange}
        activeKey={activeKey}
        className='custom_tabs'
        type='card'
        items={items}
      />
    </div>
  );
}
