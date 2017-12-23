import * as React from 'react';
import * as classNames from 'classnames';
import * as style from './style.css';
import { TodoTextInput } from '../TodoTextInput';

import autobind from 'autobind-decorator';

export namespace TodoItem {
  export interface Props {
    todo: {name, id, status};
    actions: ({action, todo}) => any;
  }

  export interface State {
    editing: boolean;
    config?: any;
  }
}

export class TodoItem extends React.Component<TodoItem.Props, TodoItem.State> {

  constructor(props?: TodoItem.Props, context?: any) {
    super(props, context);
    this.state = {
      editing: false,
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  handleDoubleClick() {
    this.setState({ editing: true });
  }

  handleSave(todo: any, text: string) {
    if(text.length === 0) {
      this.action('delete', todo);
      // this.props.deleteTodo(id);
    } else {
      todo.name = text;
      this.action('edit', todo);
      // this.props.editTodo({ id, text });
    }
    this.setState({ editing: false });
  }

  @autobind
  action(fn, todo) {
    this.props.actions({ action: fn, todo})
  }

  render() {
    const { todo } = this.props;

    let element;
    if(this.state.editing) {
      element = (
        <TodoTextInput text={todo.name}
          editing={this.state.editing}
          onSave={(text) => this.handleSave(todo, text)} />
      );
    } else {
      element = (
        <div className={style.view}>
          <input className={style.toggle}
            type="checkbox"
            checked={todo.status==='notStarted' ? false : true}
            onChange={(e) => {
              if(!e.target.checked) {
                todo.status = 'notStarted';
                this.action('update status', todo);
              } else {
                this.action('complete', todo)
              }
            }} />

          <label onDoubleClick={this.handleDoubleClick}>
            {todo.name}
          </label>

          <button className={style.destroy} onClick={() => this.action('delete', todo)} />
        </div>
      );
    }

    // TODO: compose
    const classes = classNames({
      [style.completed]: todo.status==='completed',
      [style.editing]: this.state.editing,
      [style.normal]: !this.state.editing
    });

    return (
      <li className={classes}>
        {element}
      </li>
    );
  }
}
