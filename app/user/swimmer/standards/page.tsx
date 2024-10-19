'use client';
import SwimmerPageLayout from '../SwimmerPageLayout';
import React from 'react';
import { useUser } from '../../../context/UserContext';
import SwimmerStandardsProgress from "@components/elements/swimResults/SwimmerStandardsProgress";

const StandardsPage = () => {
  const userContext = useUser();

  if (userContext.loading) return <div>Loading...</div>;
  if (userContext.error) return <div>Error: {userContext.error}</div>;
  if (!userContext.user) return <div>No user found</div>;

  return (
    <SwimmerPageLayout>
      <div>
        <h1>Swimmer Standards</h1>
        <SwimmerStandardsProgress swimmerId={userContext.user.id} />
      </div>
    </SwimmerPageLayout>
  );
};

export default StandardsPage;