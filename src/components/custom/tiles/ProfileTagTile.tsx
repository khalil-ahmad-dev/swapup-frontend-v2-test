import { cn } from '@/lib/utils';
import { SUT_ProfileTagsVariantType } from '@/types/profile.types';
import { ReactElement } from 'react';

interface IProp {
  className?: string;
  variant?: SUT_ProfileTagsVariantType;
  title?: string;
  showIcon?: boolean;
}

interface IVariantItem {
  key: SUT_ProfileTagsVariantType;
  title: string;
  icon: ReactElement;
}

const defaultIcon =
  <svg className='w-3.5' viewBox="0 0 14 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 4.66667L4.77273 2.33333L7 0L9.22727 2.33333L7 4.66667ZM0 12V9.33333C0 8.95556 0.124727 8.63889 0.374182 8.38333C0.623636 8.12778 0.923151 8 1.27273 8H3.35682C3.56894 8 3.77045 8.05556 3.96136 8.16667C4.15227 8.27778 4.30606 8.42778 4.42273 8.61667C4.7303 9.05 5.10958 9.38889 5.56054 9.63333C6.01151 9.87778 6.49133 10 7 10C7.5197 10 8.00503 9.87778 8.456 9.63333C8.90697 9.38889 9.28073 9.05 9.57727 8.61667C9.71515 8.42778 9.877 8.27778 10.0628 8.16667C10.2486 8.05556 10.4421 8 10.6432 8H12.7273C13.0879 8 13.3901 8.12778 13.6341 8.38333C13.878 8.63889 14 8.95556 14 9.33333V12H9.54545V10.4833C9.17424 10.7611 8.77376 10.9722 8.344 11.1167C7.91424 11.2611 7.46624 11.3333 7 11.3333C6.54394 11.3333 6.09848 11.2584 5.66364 11.1087C5.22879 10.9589 4.82576 10.7449 4.45455 10.4667V12H0ZM1.90909 7.33333C1.37879 7.33333 0.92803 7.13889 0.556818 6.75C0.185606 6.36111 0 5.88889 0 5.33333C0 4.76667 0.185606 4.29178 0.556818 3.90867C0.92803 3.52556 1.37879 3.33378 1.90909 3.33333C2.45 3.33333 2.90351 3.52511 3.26964 3.90867C3.63576 4.29222 3.81861 4.76711 3.81818 5.33333C3.81818 5.88889 3.63533 6.36111 3.26964 6.75C2.90394 7.13889 2.45042 7.33333 1.90909 7.33333ZM12.0909 7.33333C11.5606 7.33333 11.1098 7.13889 10.7386 6.75C10.3674 6.36111 10.1818 5.88889 10.1818 5.33333C10.1818 4.76667 10.3674 4.29178 10.7386 3.90867C11.1098 3.52556 11.5606 3.33378 12.0909 3.33333C12.6318 3.33333 13.0853 3.52511 13.4515 3.90867C13.8176 4.29222 14.0004 4.76711 14 5.33333C14 5.88889 13.8172 6.36111 13.4515 6.75C13.0858 7.13889 12.6322 7.33333 12.0909 7.33333Z" fill="currentColor" />
  </svg>;

const variantsData: IVariantItem[] = [
  {
    key: "normie",
    title: "Normie",
    icon: defaultIcon
  },
  {
    key: "collector",
    title: "Collector",
    icon: defaultIcon
  },
  {
    key: "trader",
    title: "Trader",
    icon: defaultIcon
  },
  {
    key: "community-member",
    title: "Community Member",
    icon: defaultIcon
  },
  {
    key: "premium",
    title: "Premium",
    icon:
      <svg className='w-3.5' viewBox="0 0 14 13" fill="currenColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 11.6316H14V13H0V11.6316ZM0 2.05263L3.5 4.10526L7 0L10.5 4.10526L14 2.05263V10.2632H0V2.05263Z" fill="currentColor" />
      </svg>
  },
];

const ProfileTagTile = ({ className, variant = "normie", title, showIcon = true }: IProp) => {

  const currenVariantItem = variantsData.find(item => item.key === variant);

  return (
    <div className={cn(
      "tile-design capitalize",
      variant === "normie" && "text-primary dark:text-su_primary",
      variant === "premium" && "text-su_warning dark:text-su_warning bg-su_tag_buttermilk dark:bg-su_tag_buttermilk",
      variant === "trader" && "text-su_brand_week dark:text-su_brand_week bg-su_tag_periwinkle dark:bg-su_tag_periwinkle",
      variant === "collector" && "text-su_positive dark:text-su_positive bg-su_tag_tea_green dark:bg-su_tag_tea_green",
      variant === "community-member" && "text-su_light_pink dark:text-su_light_pink bg-su_tag_pale_mauve dark:bg-su_tag_pale_mauve",
      className
    )} >

      {showIcon && currenVariantItem?.icon}

      {title ? title : currenVariantItem?.title}
    </div>
  );
};

export default ProfileTagTile;