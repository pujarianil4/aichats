import "./index.scss";

export default function YoutubeVideo({ youtubeLink }: { youtubeLink: string }) {
  // https://www.googleapis.com/youtube/v3/videos?part=status&id=LIVE_VIDEO_ID&key=YOUR_API_KEY
  // check the if video is publically availabel or not
  const videoId = youtubeLink.split("v=")[1]?.split("&")[0];
  return (
    <div className='videoContainer'>
      <p>Live &bull;</p>
      <iframe
        key={youtubeLink}
        src={`${youtubeLink}?autoplay=1&mute=1&rel=0&modestbranding`}
        // src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding`}
        title='YouTube video player'
        className='ytIframe'
        frameBorder='0'
        allow='autoplay; encrypted-media'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      ></iframe>
    </div>
  );
}
