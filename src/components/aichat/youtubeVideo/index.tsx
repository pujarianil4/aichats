import "./index.scss";

export default function YoutubeVideo({ youtubeLink }: { youtubeLink: string }) {
  return (
    <div className='videoContainer'>
      <p>Live &bull;</p>
      <iframe
        src={`${youtubeLink}?autoplay=1&mute=1&rel=0&modestbranding=1`}
        title='YouTube video player'
        allow='autoplay; encrypted-media'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      ></iframe>
    </div>
  );
}
