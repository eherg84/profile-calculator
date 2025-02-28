/**
 * UI Configuration
 * Centralizes all UI-related configurations and constants
 */

// View Types
export const ViewType = {
    TABLE: 'table',
    SUMMARY: 'summary',
    MATERIAL_LIST: 'material_list'
};

// Sort Direction
export const SortDirection = {
    ASC: 'ascending',
    DESC: 'descending'
};

// Filter Operator
export const FilterOperator = {
    EQUALS: 'equals',
    CONTAINS: 'contains',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    BETWEEN: 'between',
    IN: 'in'
};

// Default table configuration
export const TableDefaults = {
    pageSize: 50,
    pageSizeOptions: [10, 25, 50, 100],
    defaultSortDirection: SortDirection.ASC,
    maxFilterValues: 10
};

// Theme configuration
export const ThemeConfig = {
    light: {
        name: 'Light',
        colors: {
            primary: '#4CAF50',
            secondary: '#2196F3',
            background: '#ffffff',
            surface: '#f5f5f5',
            text: '#000000',
            error: '#f44336',
            warning: '#ff9800',
            success: '#4caf50'
        },
        typography: {
            fontFamily: 'Arial, sans-serif',
            fontSize: {
                small: '12px',
                medium: '14px',
                large: '16px',
                heading: '20px'
            }
        }
    },
    dark: {
        name: 'Dark',
        colors: {
            primary: '#66bb6a',
            secondary: '#42a5f5',
            background: '#121212',
            surface: '#1e1e1e',
            text: '#ffffff',
            error: '#ef5350',
            warning: '#ffa726',
            success: '#66bb6a'
        },
        typography: {
            fontFamily: 'Arial, sans-serif',
            fontSize: {
                small: '12px',
                medium: '14px',
                large: '16px',
                heading: '20px'
            }
        }
    }
};

// Layout configuration
export const LayoutConfig = {
    density: {
        comfortable: {
            name: 'Comfortable',
            spacing: {
                small: '8px',
                medium: '16px',
                large: '24px'
            },
            padding: {
                small: '4px 8px',
                medium: '8px 16px',
                large: '16px 24px'
            }
        },
        compact: {
            name: 'Compact',
            spacing: {
                small: '4px',
                medium: '8px',
                large: '16px'
            },
            padding: {
                small: '2px 4px',
                medium: '4px 8px',
                large: '8px 16px'
            }
        }
    },
    breakpoints: {
        small: '600px',
        medium: '960px',
        large: '1280px'
    }
};

// Default preferences
export const DefaultPreferences = {
    theme: 'light',
    density: 'comfortable',
    autoSave: true,
    defaultView: ViewType.TABLE,
    dateFormat: 'YYYY-MM-DD',
    numberFormat: {
        decimal: '.',
        thousand: ',',
        precision: 2
    }
};

// Column configuration
export const ColumnConfig = {
    resizable: true,
    minWidth: 50,
    maxWidth: 500,
    defaultWidth: 150
};

// Animation configuration
export const AnimationConfig = {
    duration: {
        short: '200ms',
        medium: '300ms',
        long: '400ms'
    },
    easing: {
        standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
        decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
    }
};

// Toast/notification configuration
export const NotificationConfig = {
    position: 'bottom-right',
    duration: 5000, // ms
    maxVisible: 3,
    types: {
        info: {
            icon: 'info',
            color: ThemeConfig.light.colors.secondary
        },
        success: {
            icon: 'check_circle',
            color: ThemeConfig.light.colors.success
        },
        warning: {
            icon: 'warning',
            color: ThemeConfig.light.colors.warning
        },
        error: {
            icon: 'error',
            color: ThemeConfig.light.colors.error
        }
    }
}; 