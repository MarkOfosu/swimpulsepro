"use client";
import CoachPageLayout from "../page"
import CreateMetricForm from "./createMetricForm";
import InputResultsForm from "./inputResultsForm";


const metricsPage = () => {
    return (
        <CoachPageLayout>
        <div>
        <h1>Metrics Page</h1>
        <CreateMetricForm />

        <p>swimmer will submit results in something like this</p>
        <InputResultsForm metric={{ id: "1", name: '50m Freestyle', type: 'Test Set', swimmerId: '1' }} />

        </div>
        </CoachPageLayout>
    );
    }

export default metricsPage;
