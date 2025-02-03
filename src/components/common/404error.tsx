import "./index.scss";
import error404 from "../../assets/404error.svg";

export default function Error404() {
  return (
    <section className='error404'>
      <img src={error404} alt='no data' />
    </section>
  );
}
