import { Outlet } from "react-router-dom";
import StylistSidebar from "../../components/Stylist/StylistSidebar";

export default function StylistLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <StylistSidebar />

      <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
