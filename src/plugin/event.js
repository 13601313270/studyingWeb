
export default {
  events: {},
  on(event, callback) {
      this.events[event] = [];
      this.events[event].push(callback);
      // if(!this.events[event]) {
      //     this.events[event] = [];
      // }
      // if(!this.events[event].includes(callback)) {
      //     this.events[event].push(callback);
      // }
  },
  emit(event) {
      if(this.events[event]) {
          this.events[event].forEach(func => {
              func()
          })
      }
  }
}
