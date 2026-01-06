const endPoints = {
    employee: {
        register: {
            url: '/employees',
            method: 'POST'
        },
        get: {
            url: '/employees',
            method: 'GET'
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
        }
    }
}

export default endPoints;