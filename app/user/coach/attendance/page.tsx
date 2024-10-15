import CoachPageLayout from "../CoachPageLayout";
import AttendanceRecorder  from "./AttendanceRecorder";


const AttendancePage: React.FC = () => {
    return (
        <CoachPageLayout >
            <AttendanceRecorder />
        </CoachPageLayout>
    );
}

export default AttendancePage;