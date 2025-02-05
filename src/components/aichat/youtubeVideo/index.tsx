import "./index.scss";

export default function YoutubeVideo({ youtubeLink }: { youtubeLink: string }) {
  const extractYouTubeID = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:embed\/|watch\?v=|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeID(youtubeLink);

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
