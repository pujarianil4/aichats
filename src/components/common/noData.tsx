import "./index.scss";
import noData from "../../assets/noDataFound.svg";

export default function NoData() {
  return (
    <section className='no_data'>
      <img src={noData} alt='no data' />
    </section>
  );
}
