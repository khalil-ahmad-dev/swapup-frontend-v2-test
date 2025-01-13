import { useState } from 'react';
import CustomOutlineButton from '@/components/custom/shared/CustomOutlineButton';
import CopyTile from '@/components/custom/tiles/CopyTile';
import { Card } from '@/components/ui/card';
import EditRecordsDialog from './EditRecordsDialog';

const SubdomainRecordsTabContent = () => {
  const [openEditRecordsDialog, setOpenEditRecordsDialog] = useState(false);

  return (
    <Card className='bg-su_secondary_bg p-4 lg:p-6 rounded-sm col-span-1 space-y-7 text-xs lg:text-sm text-su_secondary font-normal' >
      {/*Text Record section */}
      <div className='space-y-1' >
        <div className='flex items-center' >
          <span className='w-[32%] lg:w-[18%]' >Text</span>
          <span className='text-center w-full text-su_primary ' >0 Records</span>
        </div>

        <CopyTile
          textToCopy={"phenomenonstud1"}
          className='p-3 rounded-md'
        >
          <span className='w-full flex items-center gap-2 text-xs lg:text-sm text-su_primary line-clamp-1' >
            <svg className='w-4' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0546 0L9.69196 6.77714L16 16H11.061L7.19664 10.4057L2.76913 16H0.315144L6.04973 8.74857L0 0H5.06296L8.56054 5.11429L12.6006 0H15.0546ZM13.1017 14.3771L4.32418 1.53714H2.86212L11.7378 14.3771H13.0965H13.1017Z" fill="#868691" />
            </svg>

            phenomenonstud1
          </span>
        </CopyTile>
      </div>

      {/*Address Record section */}
      <div className='space-y-1' >
        <div className='flex items-center' >
          <span className='w-[32%] lg:w-[18%]' >Address</span>
          <span className='text-center w-full text-su_primary ' >0 Records</span>
        </div>

        <div className='space-y-2' >
          <CopyTile
            textToCopy={"0x1431F28C4cd4deA4332128297cc43aD1EdD23f83"}
            className='p-3 rounded-md'
          >
            <span className='w-full flex items-center gap-2 text-xs lg:text-sm text-su_primary line-clamp-1' >
              <img
                className='w-4 h-4'
                src="/assets/svgs/ethereum.svg"
                alt=""
              />

              0x1431F28C4cd4deA4332128297cc43aD1EdD23f83
            </span>
          </CopyTile>

          <CopyTile
            textToCopy={"0x1431F28C4cd4deA4332128297cc43aD1EdD23f83"}
            className='p-3 rounded-md'
          >
            <span className='w-full flex items-center gap-2 text-xs lg:text-sm text-su_primary line-clamp-1' >
              <img
                className='w-4 h-4'
                src="/assets/svgs/ethereum.svg"
                alt=""
              />

              0x1431F28C4cd4deA4332128297cc43aD1EdD23f83
            </span>
          </CopyTile>

          <CopyTile
            textToCopy={"0x1431F28C4cd4deA4332128297cc43aD1EdD23f83"}
            className='p-3 rounded-md'
          >
            <span className='w-full flex items-center gap-2 text-xs lg:text-sm text-su_primary line-clamp-1' >
              <img
                className='w-4 h-4'
                src="/assets/svgs/ethereum.svg"
                alt=""
              />

              0x1431F28C4cd4deA4332128297cc43aD1EdD23f83
            </span>
          </CopyTile>

          <CopyTile
            textToCopy={"0x1431F28C4cd4deA4332128297cc43aD1EdD23f83"}
            className='p-3 rounded-md'
          >
            <span className='w-full flex items-center gap-2 text-xs lg:text-sm text-su_primary line-clamp-1' >
              <img
                className='w-4 h-4'
                src="/assets/svgs/ethereum.svg"
                alt=""
              />

              0x1431F28C4cd4deA4332128297cc43aD1EdD23f83
            </span>
          </CopyTile>

        </div>
      </div>


      {/*Content hash section */}
      <div className='space-y-1' >
        <div className='flex items-center' >
          <span className='w-[32%] lg:w-[18%]' >Content hash</span>
          <span className='text-center w-full text-su_primary ' >No content hash</span>
        </div>

        <CopyTile
          textToCopy={"ipfs://Qmd2o3CwKNiXEscxmbvEA9J22tQTmKBWnxmhVT5dRQ92Hm/"}
          className='p-3 rounded-md'
        >
          <span className='w-full flex items-center gap-2 text-xs lg:text-sm text-su_primary line-clamp-1' >
            ipfs://Qmd2o3CwKNiXEscxmbvEA9J22tQTmKBWnxmhVT5dRQ92Hm/
          </span>
        </CopyTile>
      </div>


      <CustomOutlineButton
        containerClasses=""
        className='py-3 px-6'
        icon={
          <svg className='size-4' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12.8538V15.5556C0 15.8045 0.195529 16 0.444384 16H3.14624C3.26178 16 3.37732 15.9556 3.45731 15.8667L13.1627 6.17022L9.82978 2.83734L0.133315 12.5338C0.0444385 12.6227 0 12.7293 0 12.8538ZM15.7401 2.33963L13.6604 0.259915C13.5781 0.177523 13.4805 0.112156 13.373 0.0675565C13.2654 0.0229568 13.1502 0 13.0338 0C12.9174 0 12.8021 0.0229568 12.6946 0.0675565C12.5871 0.112156 12.4894 0.177523 12.4072 0.259915L10.7808 1.88636L14.1136 5.21924L15.7401 3.5928C15.8225 3.51057 15.8878 3.41291 15.9324 3.30539C15.977 3.19787 16 3.08261 16 2.96621C16 2.84981 15.977 2.73456 15.9324 2.62704C15.8878 2.51952 15.8225 2.42186 15.7401 2.33963Z" fill="white" />
          </svg>
        }

        onClick={() => { setOpenEditRecordsDialog(true); }}
      >
        Edit records
      </CustomOutlineButton>

      <EditRecordsDialog
        open={openEditRecordsDialog}
        setOpen={setOpenEditRecordsDialog}
      />
    </Card>
  );
};

export default SubdomainRecordsTabContent;