import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    const buttons = album.songs.map((song, index) => index + 1);

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0.8,
      buttons: buttons
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.setSong = this.setSong.bind(this);
    this.handleSongClick = this.handleSongClick.bind(this);

    this.formatTime = this.formatTime.bind(this);
    this.refreshButtons = this.refreshButtons.bind(this);
    this.changeToPlayButton = this.changeToPlayButton.bind(this);
    this.changeToPauseButton = this.changeToPauseButton.bind(this);

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

  refreshButtons() {
    return this.state.album.songs.map((song, index) => index + 1);
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song, index) {
    const isSameSong = this.state.currentSong === song;

    if (this.state.isPlaying && isSameSong) {
      this.pause();

      this.changeToPlayButton(song, index);
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();

      this.changeToPauseButton(song, index);
    }
  }

  changeToPlayButton(song, index) {
    const buttonElement = <span className="ion-play"></span>;
    const newButtons = this.refreshButtons();
    newButtons[index] = buttonElement;
    this.setState(
      { buttons: newButtons }
    );
  }

  changeToPauseButton(song, index) {
    const buttonElement = <span className="ion-pause"></span>;
    const newButtons = this.refreshButtons();
    newButtons[index] = buttonElement;
    this.setState(
      { buttons: newButtons }
    );
  }

  //<span className="song-number">{index + 1}</span>
  //<span className="ion-play"></span>
  //<span className="ion-pause"></span>

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
    this.changeToPauseButton(newSong, newIndex);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const lastSongIndex = this.state.album.songs.length - 1;
    const newIndex = Math.min(currentIndex + 1, lastSongIndex);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
    this.changeToPauseButton(newSong, newIndex);
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

  render() {    
    return (
      <div className="album-player">

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
                      <td className="song-actions">
                        <button>
                          <span>{this.state.buttons[index]}</span>
                        </button>
                      </td>
                      <td className="song-title">{song.title}</td>
                      <td className="song-duration">{this.formatTime(song.duration)}</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>

          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            currentTime={this.audioElement.currentTime}
            duration={this.audioElement.duration}
            volume={this.state.volume}
            formatTime={this.formatTime}
            handleSongClick={() => this.handleSongClick(this.state.currentSong, this.state.album.songs.findIndex(song => this.state.currentSong === song))}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}
          />

        </section>
      </div>
    );
  }
}

export default Album;
