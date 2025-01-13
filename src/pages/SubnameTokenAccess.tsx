import CopyTile from '@/components/custom/tiles/CopyTile';
import { Button } from '@/components/ui/button';
import { Environment } from '@/config';
import { handleShowNotificationToast } from '@/lib/helpers';
import { getUserAuthTokens } from '@/lib/minting';
import { getShortenWalletAddress } from '@/lib/utils';
import { AuthTokenResponse } from 'namespace-sdk/dist/clients/types/auth';
import React, { useState } from 'react';

const SubnameTokenAccess = () => {

  const [tokens, setTokens] = useState<AuthTokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAccessTokens = async () => {
    try {
      setIsLoading(true);

      const tokensRes = await getUserAuthTokens();
      console.log("Tokens: ", tokensRes);

      setTokens(tokensRes);

    } catch (error: any) {
      console.log("Error getting access tokens: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.message} || ${error.response.data.message} || ${error}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">

      <div className='w-full flex flex-col items-center justify-center gap-4' >
        <h2 className='text-2xl font-bold ' >Get your subname access tokens</h2>
        <Button
          isLoading={isLoading}
          onClick={handleGetAccessTokens}
          className=''
        >
          Get Subname Access
        </Button>
      </div>

      {tokens &&
        <div className='bg-su_secondary_bg p-4 rounded-md space-y-4' >
          <h3 className='text-2xl font-bold text-center' >
            {Environment.NAMESPACE_LISTED_ENS_NAME}
          </h3>

          <div className='space-y-1' >
            <h3 className='text-xl font-bold' >Access Token:</h3>
            <CopyTile
              className='dark:bg-transparent p-0 text-sm font-normal dark:text-su_secondary'
              textToCopy={tokens.accessToken}
            >
              {getShortenWalletAddress(tokens.accessToken, 'long')}
            </CopyTile>
          </div>



          <div className='space-y-1' >
            <h3 className='text-xl font-bold' >Refresh Token:</h3>
            <CopyTile
              className='dark:bg-transparent p-0 text-sm font-normal dark:text-su_secondary'
              textToCopy={tokens.refreshToken}
            >
              {getShortenWalletAddress(tokens.refreshToken, 'long')}
            </CopyTile>
          </div>

        </div>
      }
    </div>
  );
};

export default SubnameTokenAccess;