import { Outlet, useParams } from "react-router-dom";
import SalonSidebar from "../../components/Salons/SalonSidebar";

export default function SalonLayout() {
  const { id } = useParams(); // get the salon id from the route

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SalonSidebar salonId={id} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        {/* 👇 Outlet will render the nested salon pages */}
        <Outlet context={{ salonId: id }} />
      </div>
    </div>
  );
}
