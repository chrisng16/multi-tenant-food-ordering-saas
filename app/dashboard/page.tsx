import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* <div className="flex">
                <Sidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main className="flex-1 p-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden mb-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {activeSection === 'store' && (
                        <StoreSettings store={store} setStore={setStore} />
                    )}

                    {activeSection === 'menu' && (
                        <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} />
                    )}
                </main>
            </div> */}
        </div>
    );
}

export default DashboardPage