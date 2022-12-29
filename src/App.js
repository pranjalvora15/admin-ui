import AdminDashboard from "./Components/Admin Page/AdminDashboard";
import "./App.css";

export const config = {
  endpoint:
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",
};
function App() {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}

export default App;
