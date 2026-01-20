const endPoints = {
    employee: {
        register: {
            url: '/employees',
            method: 'POST'
        },
        get: {
            url: '/employees',
            method: 'GET',
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
        }
    }


}

export default endPoints;