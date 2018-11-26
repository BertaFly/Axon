import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import './style/App.css';
import UsersTable from './components/UsersTable';
import NewUserForm from './components/NewUserForm';
import Summary from './components/Summary';

class App extends Component {
  state = {
    column: null,
    data: [],
    direction: null,
    newUser: {
      first_name: '',
      last_name: '',
      dob: '',
      location: '',
    },
    dobDisplay: '',
    totalUsersFromKiev: 0,
    totalOldestAges: 0,
    longestName: '',
  };

  componentDidMount() {
    axios.get('users').then(res => {
      const countKiev = this.countFromKiev(res.data);
      const longestNameSurname = this.findLongestName(res.data);
      const oldest = this.countHighlanders(res.data);
      this.setState({
        data: res.data,
        totalUsersFromKiev: countKiev.length,
        totalOldestAges: oldest,
        longestName: longestNameSurname,
      });
    });
  }

  formatDOB = date => {
    const year = Number(date.substr(6, 4));
    const month = Number(date.substr(3, 2)) - 1;
    const day = Number(date.substr(0, 2));
    const formatedDate = new Date(year, month, day);
    return formatedDate;
  };

  countFromKiev = arr => {
    const countKiev = arr.filter(
      obj => obj.location === 'Kiev' || obj.location === 'kiev'
    );
    return countKiev;
  };

  countHighlanders = arr => {
    if (arr.length !== 0) {
      const today = new Date();
      const arrAges = arr.map(item => {
        const birthDate = this.formatDOB(item.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      });
      arrAges.sort((a, b) => b - a);
      let sum = 0;
      if (arrAges.length >= 3) {
        sum = arrAges[0] + arrAges[1] + arrAges[2];
      } else {
        sum = arrAges.length === 2 ? arrAges[0] + arrAges[1] : arrAges[0];
      }
      return sum;
    }
    return this.state.totalOldestAges;
  };

  findLongestName = arr => {
    let longestName = '';
    arr.forEach(item => {
      const fullName = item.first_name + item.last_name;
      if (fullName.length > longestName.length) {
        longestName = item.first_name + ' ' + item.last_name;
      }
    });
    return longestName;
  };

  handleSort = clickedColumn => () => {
    const {column, data, direction} = this.state;
    if (column !== clickedColumn) {
      let sortedData = [];
      if (clickedColumn !== 'dob') {
        if (clickedColumn !== 'location') {
          sortedData = _.sortBy(data, [clickedColumn]);
        } else {
          sortedData = this.sortLocation(data);
        }
      } else {
        sortedData = this.sortDOB(data);
      }
      this.setState({
        column: clickedColumn,
        data: sortedData,
        direction: 'ascending',
      });
      return;
    }
    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  sortDOB = data => {
    let sortedArr = [];
    const arrAges = data.map(item => {
      const birthDate = this.formatDOB(item.dob);
      return {age: birthDate, id: item.id};
    });
    arrAges.sort((a, b) => {
      if (a.age > b.age) {
        return -1;
      } else if (a.age < b.age) {
        return 1;
      }
      return 0;
    });
    sortedArr = arrAges.map(obj => {
      return data.find(item => item.id === obj.id);
    });
    return sortedArr;
  };

  sortLocation = data => {
    const sortedArr = [...data];
    sortedArr.sort((a, b) => {
      if (a.location.toLowerCase() > b.location.toLowerCase()) {
        return -1;
      } else if (a.location.toLowerCase() < b.location.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return sortedArr;
  };

  deleteUser = data => () => {
    const URL = 'users/' + data;
    const userIndex = this.state.data.findIndex(obj => obj.id === data);
    const tableData = [
      ...this.state.data.slice(0, userIndex),
      ...this.state.data.slice(userIndex + 1),
    ];
    axios
      .delete(URL, {params: {id: data}})
      .then(r => {
        if (r.status === 200) {
          const countKiev = this.countFromKiev(tableData);
          const longestNameSurname = this.findLongestName(tableData);
          const oldest = this.countHighlanders(tableData);
          this.setState({
            data: tableData,
            totalUsersFromKiev: countKiev.length,
            totalOldestAges: oldest,
            longestName: longestNameSurname,
          });
        }
        return true;
      })
      .catch(e => console.log(e));
  };

  handleInputChange = (e, {name, value}) => {
    const newUser = {...this.state.newUser};
    let check = false;
    if (name === 'first_name' || name === 'last_name') {
      check = /^([A-Za-z\s\-']*)$/.test(value);
    } else if (name === 'location') {
      check = /^([A-Za-z\s\-'d,.]*)$/.test(value);
    }
    if (check) {
      newUser[name] = value;
      this.setState({
        ...this.state,
        newUser,
      });
    } else {
      this.setState({
        ...this.state,
      });
    }
  };

  changeYearHandler = data => {
    const year = data.target.value.substr(0, 4);
    const month = data.target.value.substr(5, 2);
    const day = data.target.value.substr(8, 2);
    if (
      Number(year) < 1900 ||
      Number(year) > 2018 ||
      Number(month) < 1 ||
      Number(month) > 12 ||
      Number(day) < 1 ||
      Number(day) > 31) {
      return;
    }
    const newUserWithDOB = {...this.state.newUser};
    newUserWithDOB.dob = day + "." + month + "." + year;
    this.setState({
      newUser: newUserWithDOB,
      dobDisplay: data.target.value,
    });
  };

  submitNewUser = () => {
    const newUser = {...this.state.newUser};
    axios
      .post(
        'users/',
        {
          "first_name": newUser.first_name,
          "last_name": newUser.last_name,
          "dob": newUser.dob,
          "location": newUser.location
        },
        {headers: {'Content-Type': 'application/json'}},
      )
      .then(r => {
        if (r.status === 200) {
          axios.get('users').then(res => {
            const countKiev = this.countFromKiev(res.data);
            const longestNameSurname = this.findLongestName(res.data);
            const oldest = this.countHighlanders(res.data);
            this.setState({
              data: res.data,
              direction: null,
              column: null,
              newUser: {
                first_name: '',
                last_name: '',
                dob: '',
                location: '',
              },
              dobDisplay: '',
              totalUsersFromKiev: countKiev.length,
              totalOldestAges: oldest,
              longestName: longestNameSurname,
            });
          });
        }
      })
      .catch(e => console.log(e));
  };

  render() {
    const {column, data, direction} = this.state;
    return (
      <div>
        <section>
          <h1>All users</h1>
          <UsersTable
            column={column}
            data={data}
            direction={direction}
            sorted={this.handleSort}
            deleteUser={this.deleteUser}
          />
        </section>
        <section>
          <h1 className="Summary">Summary</h1>
          <Summary
            totalKiev={this.state.totalUsersFromKiev}
            totalAge={this.state.totalOldestAges}
            longestName={this.state.longestName}
          />
        </section>
        <section>
          <h1>Enter new user</h1>
          <div className="UserForm">
            <NewUserForm
              firstName={this.state.newUser.first_name}
              lastName={this.state.newUser.last_name}
              location={this.state.newUser.location}
              dob={this.state.dobDisplay}
              changed={this.handleInputChange}
              changeYear={this.changeYearHandler}
              submit={this.submitNewUser}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
