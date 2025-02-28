/**
 * UI Store for Standalone Application
 * Manages UI state, view preferences, and user interactions
 */

// View Types
const ViewType = {
    TABLE: 'table',
    SUMMARY: 'summary',
    MATERIAL_LIST: 'material_list'
};

// Sort Direction
const SortDirection = {
    ASC: 'ascending',
    DESC: 'descending'
};

// Filter Operator
const FilterOperator = {
    EQUALS: 'equals',
    CONTAINS: 'contains',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    BETWEEN: 'between',
    IN: 'in'
};

class Filter {
    constructor(data) {
        this.field = data.field || '';
        this.operator = data.operator || FilterOperator.EQUALS;
        this.value = data.value;
        this.enabled = data.enabled ?? true;
    }

    apply(item) {
        if (!this.enabled || !this.field) return true;
        
        const fieldValue = item[this.field];
        
        switch (this.operator) {
            case FilterOperator.EQUALS:
                return fieldValue === this.value;
            case FilterOperator.CONTAINS:
                return String(fieldValue).toLowerCase()
                    .includes(String(this.value).toLowerCase());
            case FilterOperator.GREATER_THAN:
                return fieldValue > this.value;
            case FilterOperator.LESS_THAN:
                return fieldValue < this.value;
            case FilterOperator.BETWEEN:
                return fieldValue >= this.value[0] && fieldValue <= this.value[1];
            case FilterOperator.IN:
                return Array.isArray(this.value) && this.value.includes(fieldValue);
            default:
                return true;
        }
    }
}

class TableState {
    constructor(data = {}) {
        this.columns = data.columns || [];
        this.sortField = data.sortField || '';
        this.sortDirection = data.sortDirection || SortDirection.ASC;
        this.filters = new Map();
        this.pageSize = data.pageSize || 50;
        this.currentPage = data.currentPage || 1;
        
        // Initialize filters
        if (data.filters) {
            for (const [field, filterData] of Object.entries(data.filters)) {
                this.filters.set(field, new Filter(filterData));
            }
        }
    }

    addFilter(field, filterData) {
        this.filters.set(field, new Filter({ field, ...filterData }));
    }

    removeFilter(field) {
        this.filters.delete(field);
    }

    clearFilters() {
        this.filters.clear();
    }

    applyFilters(items) {
        return items.filter(item =>
            Array.from(this.filters.values())
                .every(filter => filter.apply(item))
        );
    }

    sort(items) {
        if (!this.sortField) return items;

        return [...items].sort((a, b) => {
            const aVal = a[this.sortField];
            const bVal = b[this.sortField];
            
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return this.sortDirection === SortDirection.ASC ? comparison : -comparison;
        });
    }

    paginate(items) {
        const start = (this.currentPage - 1) * this.pageSize;
        return items.slice(start, start + this.pageSize);
    }
}

class UIStore {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.currentView = ViewType.TABLE;
        this.tableState = new TableState();
        this.preferences = {
            theme: 'light',
            density: 'comfortable',
            autoSave: true
        };
        this.loadState();
    }

    /**
     * Switch to a different view
     * @param {string} viewType View type to switch to
     */
    setView(viewType) {
        if (!Object.values(ViewType).includes(viewType)) {
            this.eventBus.emit('ui:error', {
                type: 'invalid_view',
                message: `Invalid view type: ${viewType}`
            });
            return;
        }

        this.currentView = viewType;
        this.eventBus.emit('ui:viewChanged', { view: viewType });
        this.saveState();
    }

    /**
     * Update table state
     * @param {Object} updates Updates to apply to table state
     */
    updateTableState(updates) {
        Object.assign(this.tableState, updates);
        this.eventBus.emit('ui:tableStateChanged', { tableState: this.tableState });
        this.saveState();
    }

    /**
     * Update user preferences
     * @param {Object} updates Updates to apply to preferences
     */
    updatePreferences(updates) {
        Object.assign(this.preferences, updates);
        this.eventBus.emit('ui:preferencesChanged', { preferences: this.preferences });
        this.saveState();
    }

    /**
     * Process items through current table state
     * @param {Array} items Items to process
     * @returns {Array} Processed items
     */
    processItems(items) {
        let processed = this.tableState.applyFilters(items);
        processed = this.tableState.sort(processed);
        return this.tableState.paginate(processed);
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
        if (!this.preferences.autoSave) return;

        const state = {
            currentView: this.currentView,
            tableState: {
                columns: this.tableState.columns,
                sortField: this.tableState.sortField,
                sortDirection: this.tableState.sortDirection,
                filters: Object.fromEntries(this.tableState.filters),
                pageSize: this.tableState.pageSize,
                currentPage: this.tableState.currentPage
            },
            preferences: this.preferences
        };

        try {
            localStorage.setItem('uiState', JSON.stringify(state));
            this.eventBus.emit('ui:stateSaved');
        } catch (error) {
            this.eventBus.emit('ui:error', {
                type: 'save_failed',
                message: error.message
            });
        }
    }

    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('uiState');
            if (!saved) return;

            const state = JSON.parse(saved);
            
            this.currentView = state.currentView;
            this.tableState = new TableState(state.tableState);
            this.preferences = state.preferences;

            this.eventBus.emit('ui:stateLoaded', { state });
        } catch (error) {
            this.eventBus.emit('ui:error', {
                type: 'load_failed',
                message: error.message
            });
        }
    }

    /**
     * Reset state to defaults
     */
    resetState() {
        this.currentView = ViewType.TABLE;
        this.tableState = new TableState();
        this.preferences = {
            theme: 'light',
            density: 'comfortable',
            autoSave: true
        };
        
        localStorage.removeItem('uiState');
        this.eventBus.emit('ui:stateReset');
    }
}

export { UIStore, ViewType, SortDirection, FilterOperator }; 