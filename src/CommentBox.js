import React, {Component} from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import './CommentBox.css';
import { fetch } from 'whatwg-fetch';

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      error: null,
      author: '',
      text: ''
    };
    this.pollInterval = null;

  }

  componentDidMount() {
    this.loadCommentsFromServer();
    if (!this.pollInterval)
      this.pollInterval = setInterval(this.loadCommentsFromServer, 2000);
  }

  componentWillUnmount() {
    if (this.pollInterval)
      clearInterval(this.pollInterval)
    this.pollInterval = null;
  }

  loadCommentsFromServer = () => {
    fetch('api/comments/')
      .then(data => data.json())
      .then(res => {
        if(!res.success)
          this.setState({error: res.error});
        else
          this.setState({data: res.data})
      })
  }

  onChangeText = e => {
    const newState = {...this.state};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submitComment = e => {
    e.preventDefault();  
    const {author, text} = this.state;

    if(!author || !text) return;
    
    fetch('api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({author, text})
    }) 
    .then(res => res.json())
    .then(res => {
      if(!res.success) 
        this.setState({error: res.error.message || res.error });
      else
        this.setState({ author: '', text: '', error: null});
    });
  }

  render() {
    return (
      <div className="container" >
        <div className="comments">
          <h2>Comments:</h2>
          <CommentList data={this.state.data} />
        </div>
        <div className="form">
          <CommentForm 
            author={this.state.author} 
            text={this.state.text} 
            handleChangeText={this.onChangeText}
            handleSubmit={this.submitComment}  
            />
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    )
  }
}

export default CommentBox;