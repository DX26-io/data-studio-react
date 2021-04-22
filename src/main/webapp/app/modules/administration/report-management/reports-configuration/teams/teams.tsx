import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';
import { fetchTeamConfig, fetchChannelParameters,setTeamConfig } from '../reports-configuration.reducer';
import TeamsUpdate from './teams-update';

export interface ITeamsProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Teams = (props: ITeamsProps) => {
  const { teams, loading, channelParametersFetched, channelParameters } = props;
  const [teamChannelConfig, setTeamChannelConfig] = React.useState();
  const [isOpen,setOpen] = React.useState(false);

  useEffect(() => {
    props.fetchTeamConfig(0);
    props.fetchChannelParameters('');
  }, []);

  const setUpdateSuccess = () => {
    props.fetchTeamConfig(0);
  };

  useEffect(() => {
    if (channelParametersFetched) {
      setTeamChannelConfig(channelParameters.filter(item => item.id === 'Teams')[0]);
    }
  }, [channelParametersFetched]);

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('reports.home.title'), route: '/administration/report-management' },
          { label: translate('reports.reportConfiguration.title'), route: '/administration/report-management/reports-configuration' },
          {
            label: translate('reports.reportConfiguration.teams.title'),
            route: '/administration/report-management/reports-configuration/teams',
          },
        ]}
        title={translate('reports.reportConfiguration.teams.title')}
      >
        <Button
          variant="cta"
          onPress={() => {
            setOpen(true);
          }}
          data-testid="create-group"
        >
          <Translate contentKey="entity.action.create">Create</Translate>
        </Button>
      </SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <TeamsUpdate
            setUpdateSuccess={setUpdateSuccess}
            setOpen={setOpen}
            properties={teamChannelConfig.connectionProperties}
          ></TeamsUpdate>
        )}
      </DialogContainer>
      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reports.reportConfiguration.teams.name">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="reports.reportConfiguration.teams.url">URL</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team, i) => (
                  <TableRow key={`user-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {team.id}
                    </TableCell>
                    <TableCell align="center">{team.webhookName}</TableCell>
                    <TableCell align="center">{team.webhookURL}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <a
                          onClick={() => {
                            setOpen(true);
                            props.setTeamConfig(team);
                          }}
                        >
                          <Edit size="S" />
                        </a>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  teams: storeState.reportConfiguration.teams,
  loading: storeState.reportConfiguration.loading,
  channelParametersFetched: storeState.reportConfiguration.channelParametersFetched,
  channelParameters: storeState.reportConfiguration.channelParameters,
});

const mapDispatchToProps = { fetchTeamConfig, fetchChannelParameters,setTeamConfig };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
