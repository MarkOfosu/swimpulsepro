"use client";
import CoachPageLayout from "../page"
import CreateMetricForm from "./createMetricForm";
import SwimmerMetricInput from "./swimmerMetricInput";


const metricsPage = () => {
    return (
        <CoachPageLayout>
        <div>
        <h1>Metrics Page</h1>
        <CreateMetricForm />
        </div>
        </CoachPageLayout>
    );
    }

export default metricsPage;
