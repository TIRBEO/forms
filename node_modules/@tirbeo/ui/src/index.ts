// Base components
export { Button } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";
export { IconButton } from "./components/ui/icon-button";
export type { IconButtonProps } from "./components/ui/icon-button";
export { Input } from "./components/ui/input";
export type { InputProps } from "./components/ui/input";
export { Textarea } from "./components/ui/textarea";
export type { TextareaProps } from "./components/ui/textarea";
export { Select } from "./components/ui/select";
export type { SelectProps } from "./components/ui/select";
export { Checkbox } from "./components/ui/checkbox";
export type { CheckboxProps } from "./components/ui/checkbox";
export { Switch } from "./components/ui/switch";
export type { SwitchProps } from "./components/ui/switch";
export { Card } from "./components/ui/card";
export type { CardProps } from "./components/ui/card";
export { Badge } from "./components/ui/badge";
export type { BadgeProps } from "./components/ui/badge";
export { Avatar } from "./components/ui/avatar";
export type { AvatarProps } from "./components/ui/avatar";
export { Dialog } from "./components/ui/dialog";
export type { DialogProps } from "./components/ui/dialog";
export { Drawer } from "./components/ui/drawer";
export type { DrawerProps } from "./components/ui/drawer";
export { Dropdown } from "./components/ui/dropdown";
export type { DropdownProps, DropdownItem } from "./components/ui/dropdown";
export { Popover } from "./components/ui/popover";
export type { PopoverProps } from "./components/ui/popover";
export { EmptyState } from "./components/ui/empty-state";
export type { EmptyStateProps } from "./components/ui/empty-state";
export { ErrorState } from "./components/ui/error-state";
export type { ErrorStateProps } from "./components/ui/error-state";
export { LoadingState } from "./components/ui/loading-state";
export type { LoadingStateProps } from "./components/ui/loading-state";
export { Alert } from "./components/ui/alert";
export type { AlertProps } from "./components/ui/alert";
export { Banner } from "./components/ui/banner";
export type { BannerProps } from "./components/ui/banner";
export { Toast, ToastProvider, Toaster } from "./components/ui/notification";
export type { ToastProps } from "./components/ui/notification";
export { Table } from "./components/ui/table";
export type { TableProps } from "./components/ui/table";
export { FilterBar } from "./components/ui/filter-bar";
export type { FilterBarProps } from "./components/ui/filter-bar";
export { KpiCard } from "./components/ui/kpi-card";
export type { KpiCardProps } from "./components/ui/kpi-card";
export { PageHeader } from "./components/ui/page-header";
export type { PageHeaderProps } from "./components/ui/page-header";
export { PermissionGate } from "./components/ui/permission-gate";
export type { PermissionGateProps } from "./components/ui/permission-gate";
export { Search } from "./components/ui/search";
export type { SearchProps } from "./components/ui/search";
export { Toggle } from "./components/ui/toggle";
export type { ToggleProps } from "./components/ui/toggle";
export { StaggeredGrid } from "./components/ui/staggered-grid";
export type { StaggeredGridProps } from "./components/ui/staggered-grid";

// TabbedCard
export { TabbedCard } from "./components/ui/tabbed-card";
export type { TabbedCardProps, Tab } from "./components/ui/tabbed-card";

// Progress components
export { ProgressRing } from "./components/ui/progress-ring";
export type { ProgressRingProps } from "./components/ui/progress-ring";
export { ProgressBar } from "./components/ui/progress-bar";
export type { ProgressBarProps } from "./components/ui/progress-bar";

// Admin components
export { Breadcrumb } from "./components/admin/Breadcrumb";
export type { BreadcrumbProps } from "./components/admin/Breadcrumb";
export { DataTable } from "./components/admin/DataTable";
export type { DataTableProps } from "./components/admin/DataTable";
export { AdminShell } from "./components/admin/AdminShell";
export type { AdminShellProps } from "./components/admin/AdminShell";
export { AdminSection } from "./components/admin/AdminSection";
export type { AdminSectionProps } from "./components/admin/AdminSection";
export { EntityPage } from "./components/admin/EntityPage";
export type { EntityPageProps } from "./components/admin/EntityPage";
export { PageToolbar } from "./components/admin/PageToolbar";
export type { PageToolbarProps } from "./components/admin/PageToolbar";
export { StatusBadge } from "./components/admin/StatusBadge";
export type { StatusBadgeProps } from "./components/admin/StatusBadge";

// Theme
export { ThemeProvider } from "./components/theme/ThemeProvider";
export type { ThemeProviderProps } from "./components/theme/ThemeProvider";

// Auth components
export { AuthLayout } from "./components/ui/auth-layout";
export { AuthCard } from "./components/ui/auth-card";
export { AuthHeader } from "./components/ui/auth-header";
export { AuthFooter, AuthFooterLink } from "./components/ui/auth-footer";
export { OTPInput } from "./components/ui/otp-input";
export type { PasswordStrengthProps } from "./components/ui/password-strength";
export { PasswordStrength } from "./components/ui/password-strength";
export { Divider } from "./components/ui/divider";
export { AuthShell } from "./components/ui/auth-shell";
export { AuthSplitLayout } from "./components/ui/auth-split-layout";

// CAPTCHA components
export { CaptchaWidget } from "./components/captcha/captcha-widget";
export type { CaptchaWidgetProps } from "./components/captcha/captcha-widget";

// Email templates
export { EMAIL_TEMPLATES, buildTemplates, renderTemplate, otpCodeBlock, buttonBlock } from "./emails";
export type { EmailTemplate } from "./emails";

// Utilities
export { cn } from "./lib/utils";

// Dashboard shell
export { DashboardShell } from "./components/ui/dashboard-shell";
export type { DashboardShellProps, NavItem, NavSection, AppLink } from "./components/ui/dashboard-shell";
