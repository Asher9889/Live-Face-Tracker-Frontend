const endPoints = {
    auth: {
        login: {
            url: '/auth/login',
            method: 'POST'
        },
        me: {
            url: "/auth/me",
            method: "GET"
        },
        logout: {
            url: "/auth/logout",
            method: "POST"
        }
    },
    employee: {
        register: {
            url: '/employees',
            method: 'POST'
        },
        get: {
            url: '/employees',
            method: 'GET',
        },
        getById: {
            url: '/employees/:employeeId',
            method: 'GET'
        },
        registerFromUnknown : {
            url: '/employees/promote',
            method: 'POST'
        },
        unknownMerge : {
            url: '/unknown/merge',
            method: 'POST' 
        }
    },

    camera: {
        token: {
            url: '/cameras/:cameraCode/token',
            method: 'GET'
        },
        start: {
            url: '/cameras/:cameraCode/start',
            method: 'POST'
        },
        register: {
            url: '/cameras',
            method: 'POST'
        },
        get: {
            url: '/cameras',
            method: 'GET'
        }
    },

    attendance: {
        getAllEvents: {
            url: '/attendance/events',
            method: 'GET'
        },
        todaySession: {
            url: '/attendance/today/:employeeId',
            method: 'GET'
        },
        employeeSummary: {
            url: '/attendance/employees/:employeeId/summary',
            method: 'GET'
        },
        employeeTimeline: {
            url: '/attendance/employees/:employeeId/timeline',
            method: 'GET'
        },
        employeeCalendar: {
            url: '/attendance/employees/:employeeId/calendar',
            method: 'GET'
        },
        employeeExport: {
            url: '/attendance/employees/:employeeId/export',
            method: 'GET'
        }
    },
    dashboard: {
        attendanceSummary: {
            url: '/dashboard/attendance-summary',
            method: 'GET'
        }
    },
    unknown: {
        getAllVisitors: {
            url: "/unknown/persons",
            method: "GET"
        }
    }


}

export default endPoints;