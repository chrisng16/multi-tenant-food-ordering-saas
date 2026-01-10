
export default function StoresLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-grow flex-1 flex-col min-h-0">
            <div className="max-h-[calc(100dvh-var(--header-height))] md:max-h-[calc(100dvh-var(--header-height)-2rem)] overflow-auto flex flex-1 flex-col gap-4 p-4 lg:p-6 md:pb-0 lg:pb-2 lg:gap-6 min-h-0">
                {children}
            </div>
        </div>

    )
}
