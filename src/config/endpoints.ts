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
        create: {
            url: '/cameras',
            method: 'POST'
        },
        get: {
            url: '/cameras',
            method: 'GET'
        }
    }


}

export default endPoints;