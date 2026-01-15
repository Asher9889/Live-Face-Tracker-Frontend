const envs = {
    liveKitUrl: import.meta.env.VITE_LIVEKIT_URL,
    wsUrl: import.meta.env.VITE_WEBSOCKET_URL,
    minioBucketName: import.meta.env.VITE_MINIO_BUCKET_NAME,
    minioServerUrl: import.meta.env.VITE_MINIO_SERVER_URL
}


export default envs;