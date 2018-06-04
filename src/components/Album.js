import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0.8,
      isHovered: false,
      hoveredSong: null
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.setSong = this.setSong.bind(this);
    this.handleSongClick = this.handleSongClick.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);

    this.formatTime = this.formatTime.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({ volume: this.audioElement.volume });
      }
    };

    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);

  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
  }

  play() {
    this.audioElement.play();
    this.setState(
      {
        isPlaying: true,
        isPaused: false
      }
    );
  }

  pause() {
    this.audioElement.pause();
    this.setState(
      {
        isPlaying: false,
        isPaused: true
      }
    );
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;

    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const lastSongIndex = this.state.album.songs.length - 1;
    const newIndex = Math.min(currentIndex + 1, lastSongIndex);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume });
  }

  formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - (minutes * 60));
    if (Number.isNaN(minutes) || Number.isNaN(seconds) || !(('' + time).trim().length > 0)) {
      minutes = '-'
      seconds = '--'
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  handleMouseEnter(song) {
    this.setState(
      { isHovered: true,
        hoveredSong: song }
    );
  }

  handleMouseLeave(song){
    this.setState(
      { isHovered: false,
        hoveredSong: null }
    );
  }

  render() {
    //const playIcon = <span className="ion-play show-play"></span>;
    //const pauseIcon = <span className="ion-pause"></span>;
    //const { isPlaying, isPaused, currentSong } = this.state;
    const playIcon = <span className="ion-play"></span>;
    const pauseIcon = <span className="ion-pause"></span>;
    const playHoverIcon = <span className="ion-play hovered"></span>;

    const { isPlaying, isPaused, isHovered, hoveredSong, currentSong } = this.state;


    return (
      <div className="album-player">

        <div className="not-player-bar">
          <div className="hero-container">
            <h2 className="hero-title">{this.state.album.title}</h2>
          </div>

          <div className="album-info-and-player">
            <section id="album-info">
              <img className="album-cover" src={this.state.album.albumCover} alt={this.state.album.title} />
              <div className="album-details">
                <h2 id="album-title">{this.state.album.title}</h2>
                <h3 className="artist">{this.state.album.artist}</h3>
                <div id="release-info">{this.state.album.releaseInfo}</div>
              </div>
            </section>

            <section id="songlist-and-player">
              <div id="song-table">
                <table id="song-list">
                  <colgroup>
                    <col id="song-number-column" />
                    <col id="song-title-column" />
                    <col id="song-duration-column" />
                  </colgroup>
                  <tbody>
                    {
                      this.state.album.songs.map( (song, index) =>
                        <tr className="song" key={index}
                                             onClick={() => this.handleSongClick(song, index)}
                                             >
                          <td className="song-actions"
                              onMouseEnter={() => this.handleMouseEnter(song)}
                              onMouseLeave={() => this.handleMouseLeave(song)}>
                            {
                              (isPlaying && (currentSong === song) && pauseIcon) ||
                              (isPaused && (currentSong === song) && playIcon) ||
                              (isHovered && (hoveredSong === song) && playHoverIcon) ||
                              <span className="song-number">{index + 1}</span>

                            /*
                            {
                              (isPlaying && (currentSong === song) && pauseIcon) ||
                              (isPaused && (currentSong === song) && playIcon) ||
                              <span className="song-number">{index + 1}</span>
                            }
                            <span className={((isPlaying || isPaused) && (currentSong === song)) ? "not-me" : "ion-play"}></span>
                            */
                            }
                          </td>
                          <td className="song-title">{song.title}</td>
                          <td className="song-duration">{this.formatTime(song.duration)}</td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <PlayerBar
          album={this.state.album}
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.state.currentTime}
          duration={this.state.duration}
          volume={this.state.volume}
          formatTime={this.formatTime}
          handleSongClick={() => this.handleSongClick(this.state.currentSong, this.state.album.songs.findIndex(song => this.state.currentSong === song))}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
        />

      </div>
    );
  }
}

export default Album;
