import { type Icon } from "@tabler/icons-react"

export type NavItem = {
    id: string
    title?: string
    name?: string
    url: string
    icon: Icon
    isActive?: boolean
}
