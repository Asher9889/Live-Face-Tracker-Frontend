let lastFramesDecoded = 0;
let lastTimestamp = 0;
let fps = 0;

export default function calculateFPS(stats: RTCStatsReport) {  
  stats.forEach((report) => {
    // We look for 'inbound-rtp' which contains video decoding stats
    if (report.type === 'inbound-rtp' && report.kind === 'video') {
      const currentFrames = report.framesDecoded;
      const currentTimestamp = report.timestamp;

      if (lastTimestamp > 0) {
        // Calculate the difference in frames and time (in seconds)
        const frameDiff = currentFrames - lastFramesDecoded;
        const timeDiff = (currentTimestamp - lastTimestamp) / 1000;

        if (timeDiff > 0) {
          fps = Math.round(frameDiff / timeDiff);
        }
      }

      // Store current values for the next calculation
      lastFramesDecoded = currentFrames;
      lastTimestamp = currentTimestamp;
    }
  });
  
  return fps;
}