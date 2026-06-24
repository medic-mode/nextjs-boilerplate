"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  documentId,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const DEFAULT_PAGE_SIZE = 10;

export function useFirestorePagination({
  collectionName,
  orderField,
  orderDirection = "desc",
  initialPageSize = DEFAULT_PAGE_SIZE,
  mapDoc,
  enabled = true,
}) {
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [allRows, setAllRows] = useState(null);
  const [allRowsLoading, setAllRowsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const orderTarget = useMemo(() => orderField || documentId(), [orderField]);

  const buildBaseQuery = useCallback(
    (...constraints) =>
      query(
        collection(db, collectionName),
        orderBy(orderTarget, orderDirection),
        ...constraints
      ),
    [collectionName, orderDirection, orderTarget]
  );

  const readTotal = useCallback(async () => {
    const countSnapshot = await getCountFromServer(
      query(collection(db, collectionName), orderBy(orderTarget, orderDirection))
    );
    return countSnapshot.data().count || 0;
  }, [collectionName, orderDirection, orderTarget]);

  const runPageQuery = useCallback(
    async (pageQuery, nextPage, nextTotalRows) => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(pageQuery);
        const docs = snapshot.docs;
        const mappedRows = docs.map((docSnap, index) => {
          const data = { id: docSnap.id, ...docSnap.data() };
          return mapDoc ? mapDoc(data, index) : data;
        });

        setRows(mappedRows);
        setFirstDoc(docs[0] || null);
        setLastDoc(docs[docs.length - 1] || null);
        setPage(nextPage);
        if (typeof nextTotalRows === "number") {
          setTotalRows(nextTotalRows);
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [collectionName, mapDoc]
  );

  const fetchFirstPage = useCallback(async () => {
    const count = await readTotal();
    await runPageQuery(buildBaseQuery(limit(pageSize)), 1, count);
  }, [buildBaseQuery, pageSize, readTotal, runPageQuery]);

  const fetchLastPage = useCallback(async () => {
    const count = await readTotal();
    const nextTotalPages = Math.max(1, Math.ceil(count / pageSize));
    const lastPageSize = count % pageSize || pageSize;
    await runPageQuery(buildBaseQuery(limitToLast(lastPageSize)), nextTotalPages, count);
  }, [buildBaseQuery, pageSize, readTotal, runPageQuery]);

  const fetchNextPage = useCallback(async () => {
    if (!lastDoc || page >= totalPages) return;
    await runPageQuery(buildBaseQuery(startAfter(lastDoc), limit(pageSize)), page + 1);
  }, [buildBaseQuery, lastDoc, page, pageSize, runPageQuery, totalPages]);

  const fetchPreviousPage = useCallback(async () => {
    if (!firstDoc || page <= 1) return;
    await runPageQuery(buildBaseQuery(endBefore(firstDoc), limitToLast(pageSize)), page - 1);
  }, [buildBaseQuery, firstDoc, page, pageSize, runPageQuery]);

  const fetchAllRows = useCallback(async () => {
    if (allRows || allRowsLoading) return;

    setAllRowsLoading(true);

    try {
      const snapshot = await getDocs(buildBaseQuery());
      const mappedRows = snapshot.docs.map((docSnap, index) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        return mapDoc ? mapDoc(data, index) : data;
      });

      setAllRows(mappedRows);
    } catch (err) {
      console.error(`Error searching ${collectionName}:`, err);
      setError(err);
    } finally {
      setAllRowsLoading(false);
    }
  }, [allRows, allRowsLoading, buildBaseQuery, collectionName, mapDoc]);

  useEffect(() => {
    if (enabled) {
      fetchFirstPage();
    }
  }, [enabled, fetchFirstPage]);

  return {
    rows,
    setRows,
    allRows,
    allRowsLoading,
    fetchAllRows,
    loading,
    error,
    page,
    pageSize,
    setPageSize,
    totalRows,
    totalPages,
    fetchFirstPage,
    fetchLastPage,
    fetchNextPage,
    fetchPreviousPage,
  };
}
