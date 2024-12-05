import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

export default function PaginationComponent({
  startingPage,
  pages,
  handlePageChange,
}: {
  startingPage: number;
  pages: number;
  handlePageChange: (input: number) => void;
}) {
  // Calculate the number of buttons to show
  const maxVisiblePages = 5; // Show up to 3 buttons
  const pageNumbers = [];

  let startPage = Math.max(1, startingPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(pages, startPage + maxVisiblePages - 1);

  // Adjust the startPage if endPage is at the total end and prevents showing less buttons
  if (endPage - startPage + 1 < maxVisiblePages && pages >= maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          {/* disabled={startingPage <= 1} */}
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => handlePageChange(startingPage - 1)}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              className="cursor-pointer"
              isActive={page === startingPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis if needed */}
        {endPage < pages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          {/* disabled={startingPage >= pages} */}
          <PaginationNext
            className="cursor-pointer"
            onClick={() => handlePageChange(startingPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
