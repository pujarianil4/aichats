import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";

interface IProps {
  listData: any[];
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  renderComponent: any;
  isGrid?: boolean;
  itemWidth?: number;
  customScrollSelector?: string;
  footerHeight?: number;
}

export default function VirtualizedContainer({
  listData,
  isLoading,
  setPage,
  limit,
  renderComponent,
  isGrid = false,
  itemWidth = 200,
  customScrollSelector = "listContainer",
  footerHeight = 50,
}: IProps) {
  const [customScrollParent, setCustomScrollParent] = useState<
    HTMLElement | undefined
  >(undefined);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const virtuosoRef = useRef<any>(null);

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
    // Scroll to the bottom if auto-scroll is enabled
    if (isAutoScrollEnabled && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: listData.length - 1 });
    }
  }, [listData, isAutoScrollEnabled]);
  const commonProps = {
    data: listData,
    // endReached: () => {
    //   if (
    //     !isLoading
    //     // &&
    //     // listData.length % limit === 0 &&
    //     // listData.length / limit === page
    //   ) {
    //     setPage((prevPage) => prevPage + 1);
    //   }
    // },
    startReached: () => {
      if (!isLoading) {
        // setPage((prevPage) => Math.max(prevPage - 1, 0));
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

  return isGrid ? (
    <VirtuosoGrid
      {...commonProps}
      components={{
        List: React.forwardRef(({ style, children }, ref) => (
          <div
            ref={ref}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
              gap: "16px",
              ...style,
            }}
            className='virtuoso_grid_list'
          >
            {children}
          </div>
        )),
        ...commonProps.components,
      }}
    />
  ) : (
    <Virtuoso {...commonProps} ref={virtuosoRef} className='virtuoso' />
  );
}
