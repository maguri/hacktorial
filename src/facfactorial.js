const SATURDAY      = 6,
      SUNDAY        = 0,
      DEFAULT_CLOCK = [ {clock_in: '9:00', clock_out: '13:00'}, {clock_in: '14:00', clock_out: '18:00'} ]

export class FacFactorial {
  constructor(year, month, clock = null) {
    this.year = year
    this.month = month - 1
    this.clock = this.setClock(clock)

    this.getPeriod()
  }

  help() {
    console.log('========HELP========')
    console.log('Usage: new FacFactorial(year, month, clock)')
    console.log('Arguments:')
    console.log('-year,  Year  [number] e.g. 2019')
    console.log('-month, Month [number] e.g. 11 (November)')
    console.log('-clock, Your schedule [Array of Hash] e.g.')
    console.log(DEFAULT_CLOCK)
    console.log('=====================')
  }

  setClock(clock) {
    if (!clock)
      return DEFAULT_CLOCK

    if (typeof(clock) !== "object")
      throw Error('Clock format must be an object e.g. ' + DEFAULT_CLOCK)

    if (clock.length === undefined || clock.length == 0)
      throw Error('Clock format must be a valid object e.g. ' + DEFAULT_CLOCK)

      clock.forEach((time) => {
        console.log('clock_in: ' + time.clock_in)
        console.log('clock_out: ' + time.clock_out)
      })

    this.clock = clock
  }

  run() {
    if(this.period_id)
      this.setWeekdaysInMonth()
    else
      console.log('Wait, period id not set!')
  }

  getPeriod() {
    fetch('https://api.factorialhr.com/attendance/periods/', { method: 'GET', credentials: 'include' }).then((response) => {
      response.text().then((content) => {
        let periods = JSON.parse(content)
        this.period_id = periods[periods.length - 1].id
      })
    })
  }

  setWeekdaysInMonth() {
    let today = new Date().getDate()

    for(let day = 1; day < today; day++) {
      if (this.isWeekday(day)) {
        this.clock.forEach((time) => {
          this.sendData(day, time.clock_in, time.clock_out)
        })
      }
    }
  }

  daysInMonth() {
    return 32 - new Date(this.year, this.month, 32).getDate()
  }

  isWeekday(day) {
    let weekday = new Date(this.year, this.month, day).getDay()

    return weekday !=SATURDAY && weekday !=SUNDAY
  }

  sendData(day, clock_in, clock_out) {
    let params = {
      clock_in: clock_in,
      clock_out: clock_out,
      day: day,
      history: [],
      minutes: 0,
      observations: null,
      period_id: this.period_id
    }
    this.sendPost(params)
  }

  sendPost(params){
    fetch('https://api.factorialhr.com/attendance/shifts', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }).then((response) => {
      response.text().then((content) => {
        console.log(content)
      })
    })
  }
}
