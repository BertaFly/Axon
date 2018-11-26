const {v4: uuid} = require('uuid');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'data.json');

class Person {
  constructor(firstName, lastName, dob, location) {
    this.first_name = firstName;
    this.last_name = lastName;
    this.dob = dob;
    this.location = location;
  }
}

module.exports = {
  create: (firstName, lastName, dob, location) => {
    const person = new Person(firstName, lastName, dob, location);
    const json = fs.readFileSync(DB_PATH);
    const data = JSON.parse(json);
    data.push({
      id: uuid(),
      ...person,
    });
    return fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), {
      encoding: 'utf8',
    });
  },

  read: () => {
    const json = fs.readFileSync(DB_PATH);
    return JSON.parse(json);
  },

  update: (id, firstName, lastName, dob, location) => {
    const json = fs.readFileSync(DB_PATH);
    const data = JSON.parse(json);
    const itemIndex = data.findIndex(v => v.id === id);
    data[itemIndex] = {
      id,
      first_name: firstName,
      last_name: lastName,
      dob,
      location,
    };
    return fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), {
      encoding: 'utf8',
    });
  },

  delete: id => {
    const json = fs.readFileSync(DB_PATH);
    const data = JSON.parse(json);
    const newData = data.filter(v => v.id !== id);
    return fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2), {
      encoding: 'utf8',
    });
  },
};
