import React from 'react';
import CommunityMemberCard from '../CommunityMemberCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const CommunityMemberSection = () => {
  return (
    <section className="p-4 lg:p-10 bg-gradient-to-tr from-su_enable_bg to-su_active_bg flex flex-col gap-10 rounded-sm" >
      <div>
        <h2 className="text-2xl font-bold leading-loose" >Upgrade your SwapUp Community Memberhip</h2>
        <p className="text-base font-normal" >Become a SwapUp community Member and  get the best trading experience with no gas fee and several vouchers.</p>
      </div>

      <ScrollArea className='w-full' >
        <div className="w-full flex items-center lg:grid lg:grid-cols-3 gap-3 lg:gap-6" >
          <CommunityMemberCard variant="bronze" />
          <CommunityMemberCard variant="silver" />
          <CommunityMemberCard variant="gold" />
        </div>

        <ScrollBar orientation='horizontal' className='h-2' />
      </ScrollArea>
    </section>
  );
};

export default CommunityMemberSection;