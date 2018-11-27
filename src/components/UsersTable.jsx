import React from 'react';
import {Table, Button} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import _ from 'lodash';

const usersTable = props => {
  return (
    <Table sortable celled fixed unstackable singleLine>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            sorted={props.column === 'first_name' ? props.direction : null}
            onClick={props.sorted('first_name')}
          >
            First Name
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={props.column === 'last_name' ? props.direction : null}
            onClick={props.sorted('last_name')}
          >
            Last Name
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={props.column === 'dob' ? props.direction : null}
            onClick={props.sorted('dob')}
          >
            DOB
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={props.column === 'location' ? props.direction : null}
            onClick={props.sorted('location')}
          >
            Location
          </Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {_.map(props.data, ({ id, first_name, last_name, dob, location }) => (
          <Table.Row key={id}>
            <Table.Cell>{first_name}</Table.Cell>
            <Table.Cell>{last_name}</Table.Cell>
            <Table.Cell>{dob}</Table.Cell>
            <Table.Cell>{location}</Table.Cell>
            <Table.Cell>
              {props.width > 580 ? (
                <Button
                  content="Delete"
                  icon="trash alternate"
                  labelPosition="left"
                  onClick={props.deleteUser(id)}
                  fluid
                />
              ) : (
                <Button icon="trash alternate" onClick={props.deleteUser(id)} />
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default usersTable;
