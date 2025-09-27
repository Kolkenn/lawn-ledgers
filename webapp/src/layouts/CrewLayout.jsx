import { Outlet } from "react-router-dom";
import CrewNav from "../components/crew/Nav";
import CrewHeader from "../components/crew/Header";

const CrewLayout = () => {
  console.log("✅ [CrewLayout] Component mounted.");
  return (
    <div className="flex flex-col h-screen bg-base-200">
      <CrewHeader />

      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>

      <CrewNav />
    </div>
  );
};

export default CrewLayout;
