import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { Virtuoso } from "react-virtuoso";

interface IProps {
  listData: any[];
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  firstItemIndex: number;
  isInitialLoad: boolean;
  setIsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  // onLoadOlderMessages: () => void;
  renderComponent: any;
  customScrollSelector?: string;
  footerHeight?: number;
}

export default function VirtualizedContainer({
  listData,
  isLoading,
  setPage,
  limit,
  firstItemIndex,
  isInitialLoad,
  setIsInitialLoad,
  // onLoadOlderMessages,
  renderComponent,
  customScrollSelector = "listContainer",
  footerHeight = 50,
}: IProps) {
  const [customScrollParent, setCustomScrollParent] = useState<
    HTMLElement | undefined
  >(undefined);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const virtuosoRef = useRef<any>(null);
  const previousDataLength = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scrollParent = document.querySelector(
        `.${customScrollSelector}`
      ) as HTMLElement;

      setCustomScrollParent(scrollParent);
    }
  }, [customScrollSelector]);

  // Detect scroll position and toggle auto-scroll behavior
  const handleScroll = () => {
    if (!customScrollParent) return;

    const { scrollTop, scrollHeight, clientHeight } = customScrollParent;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsAutoScrollEnabled(isAtBottom);
  };

  useEffect(() => {
    if (customScrollParent) {
      customScrollParent.addEventListener("scroll", handleScroll);
      return () => {
        customScrollParent.removeEventListener("scroll", handleScroll);
      };
    }
  }, [customScrollParent]);

  useEffect(() => {
    const currentDataLength = listData.length;

    // Handle scroll for initial load or socket data
    if (isInitialLoad && virtuosoRef.current && currentDataLength > 0) {
      virtuosoRef.current.scrollToIndex({ index: currentDataLength - 1 });
      setIsInitialLoad(false);
    }
    // Handle scroll when loading older data (pages)
    else if (!isInitialLoad && currentDataLength > previousDataLength.current) {
      const addedItems = currentDataLength - previousDataLength.current;
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollBy({ top: addedItems * 40 });
      }
    }

    previousDataLength.current = currentDataLength;
  }, [listData, isInitialLoad]);

  const commonProps = {
    data: listData,
    startReached: () => {
      if (!isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    itemContent: renderComponent,
    style: { overflow: "hidden" },
    customScrollParent,

    components: {
      Footer: () => <div style={{ height: `${footerHeight}px` }}></div>,
    },
  };

  return (
    <Virtuoso
      {...commonProps}
      ref={virtuosoRef}
      followOutput={isInitialLoad}
      firstItemIndex={firstItemIndex}
      className='virtuoso'
    />
  );
}
