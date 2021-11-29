import React, { useEffect, useState } from 'react';
import { Flex, DialogContainer } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import PeopleGroup from '@spectrum-icons/workflow/PeopleGroup';
import EmailGear from '@spectrum-icons/workflow/EmailGear';
import ExcludeOverlap from '@spectrum-icons/workflow/ExcludeOverlap';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import LinkCard from 'app/shared/components/link-card/link-card';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import EmailConfigUpdate from './email-config-update';
import { fetchChannelParameters } from './reports-configuration.reducer';
import { IChannel, defaultValue as channelDefaultValue } from 'app/shared/model/channel.model';

interface IReportsConfigurationProps extends StateProps, DispatchProps, RouteComponentProps {}

const ReportsConfiguration = (props: IReportsConfigurationProps) => {
  const { match, channelParameters, channelParametersFetched } = props;

  const [isEmailConfigOpen, setEmailConfigOpen] = React.useState(false);
  const [isJiraConfigOpen, setJiraConfigOpen] = React.useState(false);
  const [emailChannelConfig, setEmailChannelConfig] = React.useState<IChannel>(channelDefaultValue);
  const [jiraChannelConfig, setJiraChannelConfig] = React.useState<IChannel>(channelDefaultValue);

  useEffect(() => {
    if (props.location.search.includes('email') && !isEmailConfigOpen && channelParametersFetched) {
      setEmailConfigOpen(true);
    }
  }, [props.location.search]);

  useEffect(() => {
    props.fetchChannelParameters('');
  }, []);

  useEffect(() => {
    if (channelParametersFetched) {
      setEmailChannelConfig(channelParameters.filter(item => item.id === 'Email')[0]);
      setJiraChannelConfig(channelParameters.filter(item => item.id === 'Jira')[0]);
    }
  }, [channelParametersFetched]);
  

  const reportsConfigurationList = [
    {
      icon: <EmailGear size="L" />,
      link: `${match.url}?channel=email`,
      title: 'reportsManagement.reportConfiguration.email.title',
      description: 'reportsManagement.reportConfiguration.email.description',
    },
    {
      icon: <PeopleGroup size="L" />,
      link: `${match.url}/teams`,
      title: 'reportsManagement.reportConfiguration.teams.title',
      description: 'reportsManagement.reportConfiguration.teams.description',
    },
    {
      icon: <ExcludeOverlap size="L" />,
      link: `${match.url}?channel=jira`,
      title: 'reportsManagement.reportConfiguration.jira.title',
      description: 'reportsManagement.reportConfiguration.jira.description',
    },
  ];

  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('reportsManagement.reportConfiguration.title'), route: '/administration/report-configuration' },
        ]}
        title={translate('reportsManagement.reportConfiguration.title')}
      />
      <DialogContainer onDismiss={() => setEmailConfigOpen(false)}>
        {isEmailConfigOpen && <EmailConfigUpdate match={match} setOpen={setEmailConfigOpen} properties={emailChannelConfig.connectionProperties ? emailChannelConfig.connectionProperties : []} history={props.history}></EmailConfigUpdate>}
      </DialogContainer>
      <Flex direction="row" gap="size-700" justifyContent="center" height="100%" marginTop="10%">
        {reportsConfigurationList.map(card => (
          <LinkCard
            key={card.link}
            icon={card.icon}
            link={card.link}
            title={card.title}
            description={card.description}
            paddingXStyle="size-700"
            paddingYStyle="size-1000"
          />
        ))}
      </Flex>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  channelParameters: storeState.reportConfiguration.channelParameters,
  channelParametersFetched: storeState.reportConfiguration.channelParametersFetched,
});

const mapDispatchToProps = { fetchChannelParameters };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReportsConfiguration);
