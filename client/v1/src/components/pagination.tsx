// import { PaginationStyled } from "./pagination.styles";

// export const Pagination: React.FC = () => {
//   return (
//     <PaginationStyled>
//       <button className="anchor left">
//         <span>
//           <svg>
//             <use xlinkHref="#caret-left"></use>
//           </svg>
//         </span>
//       </button>
//       <ul>
//         <li></li>
//       </ul>
//       <button className="anchor right">
//         <span>
//           <svg>
//             <use xlinkHref="#caret-right"></use>
//           </svg>
//         </span>
//       </button>
//     </PaginationStyled>
//   );
// };

import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";

const items = [...Array(33).keys()];

export const Items: React.FC<{currentItems: number[] | null}> = ({ currentItems }) => {
  return (
    <div className="items">
      {currentItems &&
        currentItems.map((item) => (
          <div>
            <h3>Item #{item}</h3>
          </div>
        ))}
    </div>
  );
}

export const Pagination: React.FC<{ itemsPerPage: number }> = ({
  itemsPerPage,
}) => {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState<number[] | null>(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: object) => {
    if ("selected" in event) {
      const newOffset =
        ((event.selected as number) * itemsPerPage) % items.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    }
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
};
