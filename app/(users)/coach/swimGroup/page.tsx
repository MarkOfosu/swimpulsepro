"use client";

import { useState, useEffect } from "react";
import CoachPageLayout from "../page";
import CreateSwimGroup from "./createSwimGroup/page";
import Card from "@components/ui/Card";
import { useRouter } from "next/navigation";

const SwimGroupsPage: React.FC = () => {
  const [swimGroups, setSwimGroups] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSwimGroups = async () => {
     
    };
    fetchSwimGroups();
  }, []);

  // Sample group data to be displayed
  const groupData = [
    { name: "Group 1", description: "Group 1 Description" },
    { name: "Group 2", description: "Group 2 Description" },
    { name: "Group 3", description: "Group 3 Description" },
    { name: "Group 4", description: "Group 4 Description" },
  ];

  return (
    <CoachPageLayout>
      <div className="page-heading">
        <h1>Swim Groups</h1>
      </div>
      <div className="flex-container">
        {groupData.map((group) => (
          <Card
          size="small"
          color="dark"
            title={group.name}
            description={group.description}
            key={group.name}
          >
            <button
              onClick={() => router.push("/coach/swimGroup/addSwimmer")}
              className="button"
            >
              Add Swimmer
            </button>
          </Card>
        ))}
      </div>
      <CreateSwimGroup />
    </CoachPageLayout>
  );
};

export default SwimGroupsPage;
