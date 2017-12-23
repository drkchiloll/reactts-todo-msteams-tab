import * as React from 'react';
import * as style from './style.css';
import { RouteComponentProps } from 'react-router';
import { Header, MainSection } from '../../components';
import * as $ from 'jquery';
import autobind from 'autobind-decorator';

import { microsoftTeams } from '../../../microsoftTeams';

import { Properties } from '../../properties';
const {
  AzureApp: {
    clientId, authority, scopes,
    webApi, tenant, redirectUri
  }
} = Properties;

import {
  UserAgentApplication
} from 'msalx';

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    todos: TodoItemData[];
    todo: string;
  }

  export interface State {
    isLoggedIn: boolean;
    accessToken: string;
    todos?: any;
  }
}

export class App extends React.Component<App.Props, App.State> {
  clientApplication = new UserAgentApplication(
    clientId, authority,
    (errDesc:string, token:string, err:string, tokenType: string) => {
      console.log(token);
      console.log(tokenType);
    }, { redirectUri }
  )

  // Using setTimeout because we don't want to Call this TOO Early
  callTeams = function() {
    return setTimeout(() => {
      microsoftTeams.authentication.authenticate({
        url: '/auth',
        width: 650,
        height: 550,
        successCallback: (t) => {
          // Note: token is only good for one hour
          this.setState({ accessToken: t });
          this.callApiWithToken({
            path: '/beta/me/outlook/tasks',
            accessToken: t
          }).then(this.processTodos);
        },
        failureCallback: function (err) { }
      });
    }, 250);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      todos: [],
      accessToken: null
    };
    microsoftTeams.initialize();
    if(window.self !== window.top) {
      this.callTeams();
    } else {
      if(this.clientApplication.isCallback(window.location.hash)) {
        this.clientApplication.handleAuthenticationResponse(
          window.location.hash
        );
      } else {
        this.clientApplication
          .loginPopup(scopes)
          .then(this.getAccessToken)
          .then((accessToken) =>
            this.callApiWithToken({
              path: '/beta/me/outlook/tasks',
              accessToken
            }))
          .then(this.processTodos);
      }
    }
  }

  componentDidMount() {

  }

  @autobind
  processTodos({ value }: any) {
    const tasks = value.reduce((a: any[], todo: any) => {
      a.push({
        id: todo.id,
        name: todo.subject,
        status: todo.status
      });
      return a;
    }, []);
    this.setState({ todos: tasks });
  }

  @autobind
  getAccessToken() {
    return this.clientApplication
      .acquireTokenSilent(scopes)
      .then((accessToken: string) => {
        // console.log(accessToken);
        this.setState({ accessToken });
        return accessToken;
      });
  }

  @autobind
  callApiWithToken({path, accessToken, method='get', todo={}}) {
    return $.ajax({
      url: webApi + path,
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(todo)
    }).then((resp: any) => {
      if(resp &&
         resp.error &&
         resp.error.message === 'Access Token has expired'
      ) {
        return this.getAccessToken().then((accessToken: string) => 
          this.callApiWithToken({ path, accessToken, method, todo }))
      } else {
        return resp;
      }
    });
  }

  @autobind
  addTodo(todo) {
    let { accessToken, todos } = this.state;
    if(accessToken) {
      this.callApiWithToken({
        path: '/beta/me/outlook/tasks',
        method: 'post',
        accessToken,
        todo: {subject: todo}
      }).then((res: any) => {
        todos.unshift({
          id: res.id,
          name: res.subject,
          status: res.status
        });
        this.setState({ todos });
      });
    } else {
      this.getAccessToken().then(() => {
        this.addTodo(todo);
      });
    }
  }

  @autobind
  actions({ action, todo}) {
    const { accessToken, todos } = this.state;
    let apiOptions: any = {
      path: `/beta/me/outlook/tasks/${todo.id}`
    };
    if(accessToken) {
      apiOptions.accessToken = accessToken;
      switch(action) {
        case 'delete':
          apiOptions.method = 'delete';
          break;
        case 'complete':
          apiOptions.method = 'post';
          apiOptions.path = apiOptions.path + '/complete'
          break;
        case 'edit':
          apiOptions.method = 'patch';
          apiOptions.todo = { subject : todo.name };
          break;
        // STATUS can be notStarted or inProgress
        case 'update status':
          apiOptions.method = 'patch';
          apiOptions.todo = { status: todo.status };
      }
      return this.callApiWithToken(apiOptions)
        .then((resp: any) => {
          let TODOS = JSON.parse(JSON.stringify(todos)),
              todoToUpdate = todos.findIndex((t:any) => t.id===todo.id);
          if(action==='delete') {
            TODOS.splice(todoToUpdate, 1);
          } else {
            if(action==='update name')
              TODOS[todoToUpdate].name = todo.name;
            if(action==='update status')
              TODOS[todoToUpdate].status = todo.status;
            if(action==='complete')
              TODOS[todoToUpdate].status = 'completed';
          }
          this.setState({ todos: TODOS });
        })
    } else {
      this.getAccessToken().then(() => {
        this.actions({ action, todo });
      });
    }
  }

  render() {
    const { todos } = this.state,
          { children } = this.props;
    let todo: string;
    if(todos.length === 0) todo = 'LOADING...';
    else todo = '';
    return (
      <div className={style.normal}>
        <Header addTodo={this.addTodo} todo={todo || ''} />
        <MainSection todos={todos} actions={this.actions} />
        {children}
      </div>
    );
  }
}
