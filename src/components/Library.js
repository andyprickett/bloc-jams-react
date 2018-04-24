import React, { Component } from 'react';
import albumData from './../data/albums';

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = { albums: albumData };
  }
  
  render() {
    return ()
      <section className="library">
        Library will go here
      </section>
    );
  }
}

export default Library;
