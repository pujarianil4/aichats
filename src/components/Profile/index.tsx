import UserProfile from "./Profile.tsx";
import "./index.scss";
export default function ProfileHome() {
  return (
    <div className={`agenthome`}>
      <div className='agent'>
        <UserProfile />
      </div>
    </div>
  );
}
