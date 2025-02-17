import { useState } from "react";
import UserProfile from "./Profile.tsx";

import "./index.scss";
import { getUser } from "../../services/userApi.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageLoader from "../common/PageLoader.tsx";
import { useAppSelector } from "../../hooks/reduxHooks.tsx";

export default function ProfileHome() {
  // const { agentId } = useParams();
  const { isLoading, profile, error } = useAppSelector((state) => state.user);
  console.log("user", profile);
  const userId = profile?.uid;

  const user = useQuery({
    queryKey: ["privateuser", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });
  console.log("userdata", user);

  if (user.isLoading) {
    return <PageLoader />;
  }

  return (
    <div className={`agenthome`}>
      <div className='agent'>
        <UserProfile user={user} />
      </div>
    </div>
  );
}
