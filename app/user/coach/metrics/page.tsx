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

        <p>swimmer will submit results in something like this</p>
        <SwimmerMetricInput />

        </div>
        </CoachPageLayout>
    );
    }

export default metricsPage;
