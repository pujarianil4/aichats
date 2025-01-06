import "./index.scss";

export default function YoutubeVideo({ youtubeLink }: { youtubeLink: string }) {
  return (
    <div className='videoContainer'>
      <p>Live &bull;</p>
      <iframe
        width='445'
        height='792'
        src={`${youtubeLink}?autoplay=1&mute=1&rel=0&modestbranding`}
        title='YouTube video player'
        frameBorder='0'
        allow='autoplay; encrypted-media'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      ></iframe>
    </div>
  );
}
