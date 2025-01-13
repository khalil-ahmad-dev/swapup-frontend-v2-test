import React from 'react';
import ProfilePointsCard from './ProfilePointsCard';
import EmptyDataset from '../../shared/EmptyDataset';
import { useProfileStore } from '@/store/profile';

const ProfilePointsAndSwappotTabContent = () => {

  const profile = useProfileStore(state => state.profile);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" >
        <ProfilePointsCard image="/assets/images/badge.png" title="Trades created" description="Active trade Proposals you have created" points={profile.details?.points?.['created-open-trade'] || 0} />
        <ProfilePointsCard image="/assets/images/badge.png" title="Trades completed" description="Successfully finalized trade transactions" points={(profile.details?.points?.['completed-open-trade'] || 0) + (profile.details?.points?.['completed-private-trade'] || 0)} />
        {/* Subname minted points card is hidden for now */}
        {/* <ProfilePointsCard image="/assets/images/badge.png" title="Subname minted" description="Successfully minted a new subname using Swapup." points={profile.details?.points?.['minted-subname'] || 0} /> */}
        <ProfilePointsCard image="/assets/images/badge.png" title="Trades shared" description="Trades you've shared publicly" points={profile.details?.points?.['created-social-post'] || 0} />
      </div>

      <section
        className='space-y-4 relative py-1'
      >
        {/*Later on will be having empty dataset condition to show image only if the dataset is empty */}
        <img src="/assets/svgs/emptyBackground.svg" alt="" className='absolute h-full w-full top-0 left-0' />

        <div className="flex gap-4 items-center">
          <h2 className="font-semibold text-1.5xl" >Swappot</h2>

          {/* <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${'points' === 'points' ? 'bg-muted text-muted-foreground' : 'bg-muted'}`}>
        </span> */}
        </div>

        <EmptyDataset
          showBackgroundPicture={false}
          title="Swappot Functionality Coming Soon 🚀"
          description="Unlocks at 300 members. Stay tuned for exciting features!"
          icon={
            <svg className='w-9' viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.4 3.33642H10.2V0H20.4V3.33642ZM17 30.0278C17 31.7461 17.442 33.3642 18.207 34.7488C17.272 34.9323 16.303 35.0324 15.3 35.0324C11.2422 35.0324 7.35057 33.4506 4.48127 30.635C1.61196 27.8193 0 24.0005 0 20.0185C0 16.0366 1.61196 12.2178 4.48127 9.4021C7.35057 6.58645 11.2422 5.00463 15.3 5.00463C18.904 5.00463 22.219 6.23911 24.854 8.34106L27.268 5.93883C28.135 6.67285 28.9 7.44022 29.665 8.29101L27.251 10.6599C29.4203 13.3144 30.6017 16.6159 30.6 20.0185V20.6024C29.512 20.2354 28.39 20.0185 27.2 20.0185C21.573 20.0185 17 24.506 17 30.0278ZM17 10.0093H13.6V21.6867H17V10.0093ZM34 28.1761L29.087 27.759L27.2 23.355L25.279 27.759L20.4 28.1761L24.106 31.3123L22.95 36L27.2 33.5144L31.365 36L30.26 31.3123L34 28.1761Z" fill="#565665" />
            </svg>
          }
        />
      </section>
    </div >
  );
};

export default ProfilePointsAndSwappotTabContent;