export const checkIfVideoIsLive = async (videoId: string) => {
  const apiKey = import.meta.env.VITE_YT_API_KEY

  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`;

  try {
    
    const response = await fetch(url);
    const data = await response.json();

    if (
      data.items &&
      data.items.length > 0 &&
      data.items[0].liveStreamingDetails.activeLiveChatId
    ) {
      console.log("Video is live:", data.items[0].liveStreamingDetails.activeLiveChatId);
      return true;
    } else {
      console.log("Video is not live.");
      return false;
    }
  } catch (error) {
    console.error("Error checking live status:", error);
    return false;
  }
};

export const fetchChannelId = async (channelName: string) => {
  const apiKey = import.meta.env.VITE_YT_API_KEY
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${apiKey}`
    );
    const data = await response.json();
   console.log("Channel", data);
   
    if (data.items && data.items.length > 0) {
      const channel = data.items.find((item: any) => 
        item.snippet.channelTitle.toLowerCase() === channelName.toLowerCase()
      );

      if (channel) {
        return channel.id.channelId; // Return the channelId of the correct channel
      } else {
        console.error('Channel not found');
        return null;
      }
    } else {
      console.error("No channel found with the specified name");
    }
  } catch (error) {
    console.error("Error fetching channel ID:", error);
  }
};


export const getLiveId = async (channelName: string)=> {
  const apiKey = import.meta.env.VITE_YT_API_KEY



try {
  const channelId = await fetchChannelId(channelName)
  if (!channelId) return;

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${'UClUexXcW-wxUMM3qGr0iCBw'}&eventType=live&type=video&key=${apiKey}`
  );
  const data = await response.json();

  console.log("Live", data);
  
  if (data.items && data.items.length > 0) {
  
    return data.items[0].id.videoId; // Get the video ID of the live stream
  } else {
    throw Error("no")
  }
} catch (error) {
  console.error("Error fetching live stream data:", error);
}


}
