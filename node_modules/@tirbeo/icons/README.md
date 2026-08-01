# @tirbeo/icons

Tirbeo's unified icon system, re-exporting lucide-react icons.

## Installation

```bash
pnpm add @tirbeo/icons
```

## Usage

```tsx
import { SearchIcon, SettingsIcon, BellIcon } from "@tirbeo/icons";
```

## Available Icons

### Navigation
- `DashboardIcon`, `HomeIcon`, `MenuIcon`, `ChevronLeft`, `ChevronRight`

### User
- `UserIcon`, `UsersIcon`, `GroupIcon`, `OrganizationIcon`, `AvatarIcon`

### Actions
- `AddIcon`, `EditIcon`, `DeleteIcon`, `SaveIcon`, `DownloadIcon`, `UploadIcon`

### Interface
- `SearchIcon`, `SettingsIcon`, `HelpIcon`, `NotificationsIcon`, `BellIcon`
- `MoreIcon`, `RefreshIcon`, `SortIcon`, `FilterIcon`, `ColumnsIcon`

### Status
- `CheckIcon`, `WarningIcon`, `ErrorIcon`, `InfoIcon`, `LockIcon`, `UnlockIcon`

### Data
- `DatabaseIcon`, `CloudIcon`, `ServerIcon`, `MobileIcon`, `DesktopIcon`

### Security
- `ShieldIcon`, `KeyIcon`, `EyeIcon`, `EyeOffIcon`

### Communication
- `MailIcon`, `PhoneIcon`, `CalendarIcon`, `ClockIcon`

## Icon Sizes

| Size | Use Case |
|------|----------|
| 16px | Small inline icons |
| 20px | Default icon size |
| 24px | Large icons, headers |

## Guidelines

- Use icons from `@tirbeo/icons` — do not use raw lucide-react imports
- Always include accessible labels or tooltips for icon buttons
- Use consistent icon names across all applications