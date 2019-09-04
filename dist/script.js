
class Control extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { class: "controlPanel" },
      React.createElement("div", { id: "break-label" }, "Break Length"),



      React.createElement("div", { id: "break-control" },
      React.createElement("button", { id: "break-decrement", onClick: this.props.onClick },
      React.createElement("i", { class: "far fa-arrow-alt-circle-down", id: "break-decrement" })),


      React.createElement("span", { id: "break-length" }, this.props.breakSec),

      React.createElement("button", { id: "break-increment", onClick: this.props.onClick },
      React.createElement("i", { class: "far fa-arrow-alt-circle-up", id: "break-increment" }))),



      React.createElement("div", { id: "session-label" }, "Session Length"),



      React.createElement("div", { id: "session-control" },
      React.createElement("button", { id: "session-decrement", onClick: this.props.onClick },
      React.createElement("i", { class: "far fa-arrow-alt-circle-down", id: "session-decrement" })),


      React.createElement("span", { id: "session-length" }, this.props.sessionSec),

      React.createElement("button", { id: "session-increment", onClick: this.props.onClick },
      React.createElement("i", { class: "far fa-arrow-alt-circle-up", id: "session-increment" })))));




  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.reset = this.reset.bind(this);
    this.lengthClick = this.lengthClick.bind(this);
    this.state = {
      time: {},
      timer: 25 * 60,
      sessionSeconds: 25,
      breakSeconds: 5,
      running: false,
      currentSession: "session" };

  }

  secondsToTime(secs) {
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let obj = {
      "m": minutes,
      "s": seconds };

    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.timer);
    this.setState({ time: timeLeftVar });
  }



  //handle increment and decrement
  lengthClick(e) {
    if (this.state.running) {return;};
    let buttonID = e.target.id;
    let curSession = this.state.sessionSeconds;
    let curBreak = this.state.breakSeconds;
    switch (buttonID) {
      case "break-decrement":
        if (curBreak == 1) {
          return;
        }
        this.setState({
          breakSeconds: curBreak - 1 });

        break;
      case "break-increment":
        if (curBreak == 60) {
          return;
        }
        this.setState({
          breakSeconds: curBreak + 1 });

        break;
      case "session-decrement":
        if (curSession == 1) {
          return;
        }
        this.setState({
          sessionSeconds: curSession - 1,
          timer: (curSession - 1) * 60,
          time: this.secondsToTime((curSession - 1) * 60) });

        break;
      case "session-increment":
        if (curSession == 60) {
          return;
        }
        this.setState({
          sessionSeconds: curSession + 1,
          timer: (curSession + 1) * 60,
          time: this.secondsToTime((curSession + 1) * 60) });

        break;}



  }


  startTimer() {
    //if already running, pause the timer
    console.log("calling start timer", this.state.running);

    if (this.state.running) {
      clearInterval(this.timer);
      this.setState({
        running: false });

    } else
    if (this.state.running == false && this.state.timer > 0) {


      this.timer = setInterval(this.countDown, 1000);


      this.setState({
        running: true });

    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    if (this.state.timer == 0) {
      clearInterval(this.timer);
      this.switch();
    } else
    {
      this.setState({
        timer: this.state.timer - 1 },
      () => {this.setState({
          time: this.secondsToTime(this.state.timer) });

        console.log(this.state.time);

      });
    }
  }

  //play alert sound
  playAlert() {
    let sound = document.getElementById("beep");
    sound.currentTime = 0;
    sound.play();
  }

  //when one session ends, switch session
  switch() {

    let curSession = this.state.currentSession;
    if (curSession == "session") {
      this.setState({
        timer: this.state.breakSeconds * 60,
        time: this.secondsToTime(this.state.breakSeconds * 60),
        currentSession: "break",
        running: false },
      () => {
        this.playAlert();
        this.startTimer();
      });
    } else
    {
      this.setState({
        timer: this.state.sessionSeconds * 60,
        time: this.secondsToTime(this.state.sessionSeconds * 60),
        currentSession: "session",
        running: false },
      () => {

        this.playAlert();
        this.startTimer();
      });
    }
  }

  //reset button. 
  reset() {
    clearInterval(this.timer);
    this.timer = 0;
    this.setState({
      //reset to session length
      sessionSeconds: 25,
      breakSeconds: 5,
      timer: 25 * 60,
      time: this.secondsToTime(25 * 60),
      running: false,
      currentSession: "session" });

    let sound = document.getElementById("beep");
    sound.pause();
    sound.currentTime = 0;


  }

  render() {
    return (
      React.createElement("div", { class: "main" },
      React.createElement("div", { class: "header" },
      React.createElement("h1", null, "Pomodoro")),


      React.createElement(Control, { onClick: this.lengthClick,
        sessionSec: this.state.sessionSeconds,
        breakSec: this.state.breakSeconds }),

      React.createElement("div", { class: "timer" },
      React.createElement("div", { id: "timer-label" },
      this.state.currentSession),


      React.createElement("div", { id: "time-left" },
      this.state.time.m, ":", this.state.time.s)),



      React.createElement("div", { class: "footer" },
      React.createElement("button", { id: "start_stop", onClick: this.startTimer },
      React.createElement("i", { class: "fas fa-play" }),
      React.createElement("i", { class: "fas fa-pause" })),


      React.createElement("button", { id: "reset", onClick: this.reset },
      React.createElement("i", { class: "fas fa-redo-alt" }))),



      React.createElement("div", { class: "audio-wrapper" },
      React.createElement("audio", { id: "beep", src: "https://goo.gl/65cBl1" }))));






  }}


ReactDOM.render(React.createElement(App, null), document.getElementById("root"));