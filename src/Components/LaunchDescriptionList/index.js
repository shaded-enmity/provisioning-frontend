import PropTypes from 'prop-types';
import React from 'react';
import { ExpandableSection, DescriptionList, DescriptionListTerm, DescriptionListGroup, DescriptionListDescription } from '@patternfly/react-core';

import { useQuery } from 'react-query';
import { sourcesQueryKey } from '../../API/queryKeys';
import { fetchSourcesList } from '../../API';
import { useWizardContext } from '../Common/WizardContext';
import { instanceType, region } from '../ProvisioningWizard/steps/ReservationProgress/helpers';

const LaunchDescriptionList = ({ imageName }) => {
  const [{ chosenRegion, chosenSshKeyName, uploadedKey, chosenInstanceType, chosenNumOfInstances, chosenSource, sshPublicName, provider }] =
    useWizardContext();
  const { data: sources } = useQuery(sourcesQueryKey(provider), () => fetchSourcesList(provider));
  const [isExpanded, setIsExpanded] = React.useState(true);
  const onToggle = (isExpanded) => {
    setIsExpanded(isExpanded);
  };

  const getChosenSourceName = () => sources?.find((source) => source.id === chosenSource).name;
  const regionLabel = region(provider).charAt(0).toUpperCase() + region(provider).slice(1);
  const providerInstanceType = instanceType(provider).replace('_', ' ');
  const instanceTypeLabel = providerInstanceType.charAt(0).toUpperCase() + providerInstanceType.slice(1);

  return (
    <ExpandableSection toggleText={provider} onToggle={onToggle} isExpanded={isExpanded} isIndented>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Image</DescriptionListTerm>
          <DescriptionListDescription>{imageName}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Account</DescriptionListTerm>
          <DescriptionListDescription>{getChosenSourceName()}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{regionLabel}</DescriptionListTerm>
          <DescriptionListDescription>{chosenRegion}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{instanceTypeLabel}</DescriptionListTerm>
          <DescriptionListDescription>{chosenInstanceType}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Count</DescriptionListTerm>
          <DescriptionListDescription>{chosenNumOfInstances}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{uploadedKey ? 'New SSH key' : 'Existing SSH key'}</DescriptionListTerm>
          <DescriptionListDescription>{uploadedKey ? sshPublicName : chosenSshKeyName}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </ExpandableSection>
  );
};

LaunchDescriptionList.propTypes = {
  imageName: PropTypes.string.isRequired,
};
export default LaunchDescriptionList;
