import React, { useEffect, useState } from "react";
import "./index.scss";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";

interface IProps {
  listData: any[];
  isLoading: boolean;
  page: number;
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
  page,
  setPage,
  limit,
  renderComponent,
  isGrid = false,
  itemWidth = 200,
  customScrollSelector = "feedContainer",
  footerHeight = 50,
}: IProps) {
  const [customScrollParent, setCustomScrollParent] = useState<
    HTMLElement | undefined
  >(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scrollParent = document.querySelector(
        `.${customScrollSelector}`
      ) as HTMLElement;

      setCustomScrollParent(scrollParent);
    }
  }, [customScrollSelector]);
  const commonProps = {
    data: listData,
    endReached: () => {
      if (
        !isLoading &&
        listData.length % limit === 0
        // &&
        // listData.length / limit === page
      ) {
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
    <Virtuoso {...commonProps} className='virtuoso' />
  );
}
