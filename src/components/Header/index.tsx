import * as React from 'react';
import { TodoTextInput } from '../TodoTextInput';

export namespace Header {
  export interface Props {
    addTodo: (todo: string) => any;
    todo: string;
  }

  export interface State {
    /* empty */
  }
}

export class Header extends React.Component<Header.Props, Header.State> {

  constructor(props?: Header.Props, context?: any) {
    super(props, context);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(todo: string) {
    if(todo.length) {
      this.props.addTodo(todo);
    }
  }

  render() {
    let todo = this.props.todo;
    return (
      <header>
        <h1>Todos</h1>
        <TodoTextInput
          newTodo
          text={todo || ''}
          onSave={this.handleSave}
          placeholder="What needs to be done?" />
      </header>
    );
  }
}
