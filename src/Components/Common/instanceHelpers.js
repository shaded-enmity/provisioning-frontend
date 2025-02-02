import { AWS_PROVIDER, AZURE_PROVIDER } from './constants';

export const instanceLink = (instanceID, provider, region) => {
  switch (provider) {
    case AWS_PROVIDER:
      return `https://console.aws.amazon.com/ec2/home?region=${region}#InstanceDetails:instanceId=${instanceID}`;
    case AZURE_PROVIDER:
      return `https://portal.azure.com/#@rhdevcloudops.onmicrosoft.com/resource${instanceID}/overview`;
    default:
      return null;
  }
};

export const humanizeInstanceID = (instanceID, provider) => {
  switch (provider) {
    case AZURE_PROVIDER:
      return instanceID.split('/').slice(-1);
    default:
      return instanceID;
  }
};
