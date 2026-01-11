
export default function StoresLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-h-[calc(100dvh_-_var(--header-height,_0px))] md:max-h-[calc(100dvh_-_var(--header-height,_0px)_-_2rem)] overflow-y-auto flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6 md:pb-0 lg:pb-2 min-h-0">
            {children}
        </div>
    )
}
