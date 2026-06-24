"use client";

import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./TablePaginationFooter.css";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export default function TablePaginationFooter({
  selectedRows = 0,
  totalRows,
  page,
  totalPages,
  pageSize,
  onPageSizeChange,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  disabled = false,
}) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="dashboard-table-footer">
      <div className="dashboard-table-footer__selection">
        {selectedRows} of {totalRows} row(s) selected.
      </div>

      <div className="dashboard-table-footer__controls">
        <label className="dashboard-table-footer__page-size">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={disabled}
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="dashboard-table-footer__page-count">
          Page {page} of {totalPages}
        </div>

        <div className="dashboard-table-footer__buttons">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="dashboard-table-footer__button"
            onClick={onFirstPage}
            disabled={disabled || isFirstPage}
            aria-label="Go to first page"
          >
            <ChevronsLeft size={17} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="dashboard-table-footer__button"
            onClick={onPreviousPage}
            disabled={disabled || isFirstPage}
            aria-label="Go to previous page"
          >
            <ChevronLeft size={17} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="dashboard-table-footer__button"
            onClick={onNextPage}
            disabled={disabled || isLastPage}
            aria-label="Go to next page"
          >
            <ChevronRight size={17} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="dashboard-table-footer__button"
            onClick={onLastPage}
            disabled={disabled || isLastPage}
            aria-label="Go to last page"
          >
            <ChevronsRight size={17} />
          </Button>
        </div>
      </div>
    </div>
  );
}
