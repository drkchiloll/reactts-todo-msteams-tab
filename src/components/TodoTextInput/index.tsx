import * as React from 'react';
import * as classNames from 'classnames';
import * as style from './style.css';

export namespace TodoTextInput {
  export interface Props {
    text?: string;
    placeholder?: string;
    newTodo?: boolean;
    editing?: boolean;
    onSave: (text: string) => any;
  }

  export interface State {
    text: string;
  }
}

export class TodoTextInput extends React.Component<TodoTextInput.Props, TodoTextInput.State> {
  nameInput: any;
  constructor(props?: TodoTextInput.Props, context?: any) {
    super(props, context);
    this.state = {
      text: this.props.text,
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.text === '') {
      this.setState({ text: '' });
      this.nameInput.focus();
    }
  }

  handleSubmit(e) {
    const text = this.state.text.trim();
    if(e.which == 13) {
      this.props.onSave(text);
      if(this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
    e.target.focus();
  }

  handleBlur(e) {
    // console.log(this.props.newTodo);
    const text = e.target.value.trim();
    if(!this.props.newTodo) {
      this.props.onSave(text);
    }
  }

  render() {
    const classes = classNames({
      [style.edit]: this.props.editing,
      [style.new]: this.props.newTodo
    }, style.normal);

    return (
      <input className={classes}
        type="text"
        ref={(input) => { this.nameInput = input; }}
        autoFocus
        placeholder={this.props.placeholder}
        value={this.state.text}
        onBlur={this.handleBlur}
        onKeyDown={this.handleSubmit}
        onChange={this.handleChange}/>
    );
  }
}
