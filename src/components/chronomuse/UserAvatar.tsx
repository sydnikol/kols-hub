import { useIsMobile } from '../../hooks/useIsMobile';
import UserAvatar2D from './UserAvatar2D';
import UserAvatar3D from './UserAvatar3D';

export default function UserAvatar() {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full">
      {isMobile ? <UserAvatar2D /> : <UserAvatar3D />}
    </div>
  );
}
