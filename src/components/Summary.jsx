import React from 'react';
import {Header, Icon, Table} from 'semantic-ui-react';

const summary = (props) => {
  return (
    <Table basic="very" celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Parameter</Table.HeaderCell>
          <Table.HeaderCell>Data</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Header as="h4" image>
              <Icon name="users" size="small" />
              <Header.Content>
                <Header.Subheader>Users from Kiev</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>{props.totalKiev}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Header as="h4" image>
              <Icon name="hourglass half" size="small" />
              <Header.Content>
                <Header.Subheader>
                  Sum of three oldest users ages
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>{props.totalAge}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Header as="h4" image>
              <Icon name="vcard" size="small" />
              <Header.Content>
                <Header.Subheader>Longest first + last name</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>{props.longestName}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default summary;
