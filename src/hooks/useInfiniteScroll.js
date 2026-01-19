import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook để implement infinite scroll
 * @param {Function} loadMoreFn - Hàm load thêm dữ liệu, nhận (page) và return Promise
 * @param {Object} options - Cấu hình
 * @returns {Object} - State và methods
 */
function useInfiniteScroll(loadMoreFn, options = {}) {
  const {
    threshold = 300, // Khoảng cách từ bottom để trigger load (px)
    initialPage = 1,
    pageSize = 20
  } = options;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // Thêm total count
  
  const loadingRef = useRef(false);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loadMoreFn(initialPage, pageSize);
      
      if (result && result.data) {
        setData(result.data);
        setHasMore(result.hasMore ?? (result.data.length === pageSize));
        setTotal(result.total || result.data.length); // Lưu total
        setPage(initialPage + 1);
      }
    } catch (err) {
      console.error('Load initial data error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadMoreFn, initialPage, pageSize]);

  // Auto load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const result = await loadMoreFn(page, pageSize);
      
      if (result && result.data) {
        setData(prev => [...prev, ...result.data]);
        setHasMore(result.hasMore ?? (result.data.length === pageSize));
        setTotal(result.total || 0); // Update total nếu có
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Load more error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [loadMoreFn, page, pageSize, hasMore]);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      const scrollContainer = document.querySelector('[data-scroll-container]');
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < threshold) {
        loadMore();
      }
    };

    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [loadMore, threshold, hasMore]);

  // Reset function
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setTotal(0);
    loadingRef.current = false;
    loadInitialData();
  }, [initialPage, loadInitialData]);

  return {
    data,
    loading,
    hasMore,
    error,
    total,
    loadMore,
    reset,
    loadInitialData
  };
}

export { useInfiniteScroll };