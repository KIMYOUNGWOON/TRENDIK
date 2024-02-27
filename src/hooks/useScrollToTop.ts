import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]); // location이 변경될 때마다 실행
}

export default useScrollToTop;
