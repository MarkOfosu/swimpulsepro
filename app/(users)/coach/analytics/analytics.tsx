"use client";
import React, { useState } from "react";
import { Line, Radar, Pie } from "react-chartjs-2";
import {
  swimmersPerformanceData,
  swimGroupsData,
  skillAssessmentData,
  achievementRateData,
  activityTrendsData,
} from "../../../utils/testData";
import styles from "../../../styles/Analytics.module.css";

// Import necessary components from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";

// Register the components and scales you want to use
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const Analytics: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSwimmer, setSelectedSwimmer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(event.target.value);
    setSelectedSwimmer(null); // Reset swimmer selection when group changes
    setSearchTerm(""); // Clear search when a new group is selected
    setSuggestions([]); // Clear suggestions
  };

  const handleSwimmerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSwimmer(event.target.value);
    setSearchTerm(""); // Clear search when a swimmer is selected
    setSuggestions([]); // Clear suggestions
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);

    if (!term) {
      setSuggestions([]);
      return;
    }

    const groupSuggestions = swimGroupsData
      .filter((group) => group.groupName.toLowerCase().includes(term))
      .map((group) => ({ type: "group", name: group.groupName }));

    const swimmerSuggestions = swimmersPerformanceData
      .filter((data) =>
        data.swimmer.toLowerCase().includes(term.replace(/\s+/g, " "))
      )
      .map((data) => ({ type: "swimmer", name: data.swimmer }));

    setSuggestions([...groupSuggestions, ...swimmerSuggestions]);
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === "group") {
      setSelectedGroup(suggestion.name);
      setSelectedSwimmer(null);
    } else if (suggestion.type === "swimmer") {
      setSelectedSwimmer(suggestion.name);
      const group = swimGroupsData.find((group) =>
        group.members.includes(suggestion.name)
      );
      if (group) {
        setSelectedGroup(group.groupName);
      }
    }
    setSearchTerm(""); // Clear search after selection
    setSuggestions([]); // Clear suggestions after selection
  };

  const filteredSwimmers = selectedGroup
    ? swimGroupsData.find((group) => group.groupName === selectedGroup)?.members
    : [];

  const swimmersPerformanceChartData = {
    labels: swimmersPerformanceData.map((data) => data.date),
    datasets: selectedSwimmer
      ? [
          {
            label: selectedSwimmer,
            data: swimmersPerformanceData
              .filter((data) => data.swimmer === selectedSwimmer)
              .map((data) => data.value),
            borderColor: "rgba(75,192,192,1)",
            fill: false,
          },
        ]
      : [],
  };

  const skillAssessmentChartData = {
    labels: skillAssessmentData.labels,
    datasets: skillAssessmentData.datasets.filter(
      (dataset) => selectedSwimmer === null || dataset.label === selectedSwimmer
    ),
  };

  const achievementRateChartData = {
    labels: achievementRateData.map((data) => data.category),
    datasets: [
      {
        data: achievementRateData.map((data) => data.value),
        backgroundColor: ["rgba(75,192,192,0.4)", "rgba(255,99,132,0.4)"],
      },
    ],
  };

  const participationTrendsChartData = {
    labels: activityTrendsData.map((data) => data.date),
    datasets: [
      {
        label: "Number of Participants",
        data: activityTrendsData.map((data) => data.count),
        backgroundColor: "rgba(75,192,192,0.4)",
      },
    ],
  };

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search Group or Swimmer"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.selectionContainer}>
        <select
          className={styles.groupSelector}
          onChange={handleGroupChange}
          value={selectedGroup || ""}
        >
          <option value="">Select Group</option>
          {swimGroupsData.map((group) => (
            <option key={group.groupName} value={group.groupName}>
              {group.groupName}
            </option>
          ))}
        </select>

        {selectedGroup && (
          <select
            className={styles.swimmerSelector}
            onChange={handleSwimmerChange}
            value={selectedSwimmer || ""}
          >
            <option value="">Select Swimmer</option>
            {filteredSwimmers?.map((swimmer) => (
              <option key={swimmer} value={swimmer}>
                {swimmer}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedGroup && (
        <div className={styles.groupOverview}>
          <h2>{`${selectedGroup} Performance Overview`}</h2>

          {selectedSwimmer ? (
            <div>
              <div className={styles.chartSection}>
                <h3 className={styles.chartTitle}>
                  {`${selectedSwimmer}’s Performance Over Time`}
                </h3>
                <Line data={swimmersPerformanceChartData} />
              </div>

              <div className={styles.chartSection}>
                <h3 className={styles.chartTitle}>Skill Assessment Scores</h3>
                <Radar data={skillAssessmentChartData} />
              </div>

              <div className={styles.chartSection}>
                <h3 className={styles.chartTitle}>Achievement Rate</h3>
                <Pie data={achievementRateChartData} />
              </div>
            </div>
          ) : (
            <div className={styles.chartSection}>
              <h3 className={styles.chartTitle}>
                Participation Trends for {selectedGroup}
              </h3>
              <Line data={participationTrendsChartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
