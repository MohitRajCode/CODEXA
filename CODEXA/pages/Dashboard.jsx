import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex bg-[#090B14] min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8">

        <Navbar />

      </main>

    </div>
  );
}