import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = { albums: albumData };
  }

  render() {
    return (
      <section className="library">
        <div className="hero-container">
          <h2 className="hero-title">Albums</h2>
        </div>
        <section className="albums">
          {
            this.state.albums.map( (album, index) =>
              <div className="album" key={index} >
                <Link to={`/album/${album.slug}`} >
                  <img className="album-cover" src={album.albumCover} alt={album.title} />
                </Link>
                <div className="album-info">
                  <div className="album-title">{album.title}</div>
                  <div className="album-artist">{album.artist}</div>
                  <div className="album-song-count">{album.songs.length} songs</div>
                </div>
              </div>
            )
          }
        </section>
      </section>
    );
  }
}

export default Library;
