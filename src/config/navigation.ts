import type { LucideIcon } from 'lucide-react'
import {
	BookOpen,
	Route,
	Fish,
	Anchor,
	Images,
	History,
	Download,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：Exquisite Fishing 7 个内容分类（community 按要求已删除，不进导航栏）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'walkthrough', path: '/walkthrough', icon: Route, isContentType: true },
	{ key: 'catches', path: '/catches', icon: Fish, isContentType: true },
	{ key: 'equipment', path: '/equipment', icon: Anchor, isContentType: true },
	{ key: 'gallery', path: '/gallery', icon: Images, isContentType: true },
	{ key: 'version', path: '/version', icon: History, isContentType: true },
	{ key: 'download', path: '/download', icon: Download, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> []

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
