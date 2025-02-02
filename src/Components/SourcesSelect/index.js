import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Select, SelectOption, Spinner } from '@patternfly/react-core';
import { useQuery } from 'react-query';
import { sourcesQueryKey } from '../../API/queryKeys';
import { fetchSourcesList } from '../../API';
import { useWizardContext } from '../Common/WizardContext';
import { IB_SOURCE_PROVIDERS } from '../Common/constants';

const SourcesSelect = ({ setValidation, imageSourceID }) => {
  const [{ provider, chosenSource }, setWizardContext] = useWizardContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const selectObject = (id, name) => ({
    id,
    toString: () => name,
    compareTo: (other) => other.id === id,
  });
  const {
    error,
    isLoading,
    data: sources,
  } = useQuery(sourcesQueryKey(provider), () => fetchSourcesList(provider), {
    enabled: !!provider,
    onSuccess: (data) => {
      const id = chosenSource;

      if (IB_SOURCE_PROVIDERS.includes(provider) && imageSourceID) {
        setSelected(selectObject(imageSourceID, data.find((source) => source.id === imageSourceID).name));
        setWizardContext((prevState) => ({
          ...prevState,
          chosenSource: imageSourceID,
        }));
        setValidation('success');
      } else if (!id) {
        return;
      } else {
        setSelected(selectObject(id, data.find((source) => source.id === id).name));
      }
    },
  });

  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) {
      setSelected(null);
      setWizardContext((prevState) => ({ ...prevState, chosenSource: null }));
      setValidation('error');
    } else {
      setSelected(selection);
      setWizardContext((prevState) => ({
        ...prevState,
        chosenSource: selection.id,
      }));
      setValidation('success');
    }
    setIsOpen(false);
  };

  const selectItemsMapper = () =>
    sources.map(({ name, id }) => <SelectOption aria-label="Source account" key={id} value={selectObject(id, name)}></SelectOption>);

  if (error) {
    console.warn('Failed to fetch sources list');
    return (
      <>
        <Alert ouiaId="select_account_alert" variant="warning" isInline title="There are problems fetching accounts" />
        <Select ouiaId="select_account_empty" isDisabled placeholderText="No accounts found" aria-label="Select account" />
      </>
    );
  }

  if (isLoading) {
    return <Spinner isSVG size="sm" aria-label="Loading accounts" />;
  }

  return (
    <Select
      ouiaId="select_account"
      isOpen={isOpen}
      onToggle={(openState) => setIsOpen(openState)}
      selections={selected}
      isDisabled={!!imageSourceID}
      onSelect={onSelect}
      placeholderText="Select account"
      aria-label="Select account"
    >
      {sources && selectItemsMapper()}
    </Select>
  );
};

SourcesSelect.propTypes = {
  setValidation: PropTypes.func.isRequired,
  imageSourceID: PropTypes.string,
};

export default SourcesSelect;
