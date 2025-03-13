import axios from "axios";
import "./index.scss";
import { useEffect, useState } from "react";

interface IVideoIdResponse {
  etag: string;
  kind: string;
  id: {
    kind: string;
    videoId: string;
  };
}

export default function YoutubeVideo({ youtubeLink }: { youtubeLink: string }) {
  const [videoId, setVideoId] = useState<string>();
  const extractYouTubeID = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:embed\/|watch\?v=|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVideoId = async () => {
    const response = await axios.get(
      "https://chat-service-rq16.onrender.com/grp-intance/streamlink?id=UC-XtczUVraQxMuwjFXXDseQ"
    );
    if (response?.data?.items && response?.data?.items?.length > 0) {
      const arrayOfLiveStreams: IVideoIdResponse[] = response.data.items;
      //console.log(arrayOfLiveStreams[arrayOfLiveStreams.length - 1].id.videoId);
      setVideoId(arrayOfLiveStreams[arrayOfLiveStreams.length - 1].id.videoId);
    }
  };

  useEffect(() => {
    getVideoId();
  }, []);

  return (
    <div className='videoContainer'>
      <p>Live &bull;</p>
      <iframe
        key={youtubeLink}
        // src={`${youtubeLink}?autoplay=1&mute=1&rel=0&modestbranding`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding`}
        title='YouTube video player'
        className='ytIframe'
        allow='autoplay; encrypted-media'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      ></iframe>
    </div>
  );
}
