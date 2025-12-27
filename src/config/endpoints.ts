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
        }
    }
}

export default endPoints;