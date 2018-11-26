import React from 'react';
import {Form, Input, Button} from 'semantic-ui-react';

const newUserForm = (props) => {
  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field
          control={Input}
          label="First name"
          placeholder="First name"
          name="first_name"
          required
          value={props.firstName}
          onChange={props.changed}
          maxLength="150"
        />
        <Form.Field
          control={Input}
          label="Last name"
          placeholder="Last name"
          name="last_name"
          required
          value={props.lastName}
          onChange={props.changed}
          maxLength="150"
        />
      </Form.Group>
      <Form.Field required>
        <label htmlFor="Dob">Date of birth</label>
        <input
          id="Dob"
          type="date"
          name="dob"
          data-date-format="DD MMMM YYYY"
          placeholder="DD/MM/YYYY"
          value={props.dob}
          onChange={props.changeYear}
        />
      </Form.Field>
      <Form.Field
        control={Input}
        label="Location"
        placeholder="Location"
        name="location"
        required
        value={props.location}
        onChange={props.changed}
        maxLength="150"
      />
      <Button
        content="Submit"
        disabled={!props.firstName || !props.lastName || !props.dob || !props.location}
        fluid
        onClick={props.submit}
      />
    </Form>
  );
};

export default newUserForm;
