"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "@/lib/redux/store";
import Todo from "@/components/Todo";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        dispatch(setAuthenticated(true));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return <Todo />;
}
