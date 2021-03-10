
export interface TimerConfig {
  type: string,
  select: boolean,
  projectId: number,
  status: string,
  remainingTime: number,
  duration: number,
  completed: boolean,
  interrupted: boolean,
  startDate: string,
  endDate: string,
};

export interface State {
  timers: TimerConfig[],
  history: TimerConfig[]
};

const initialState: State = {
  timers: [
    {
      type: 'work',
      select: true,
      projectId: 1,
      status: 'ready',
      remainingTime: 15000000,
      duration: 15000000,
      completed: false,
      interrupted: false,
      startDate: '11/2/2021, 9:00',
      endDate: '11/2/2021, 9:00', // This isn't added until its part of the history array
    },
    {
      type: 'short',
      select: false,
      projectId: 1,
      status: 'ready',
      remainingTime: 15000000,
      duration: 15000000,
      completed: false,
      interrupted: false,
      startDate: '11/2/2021, 9:00',
      endDate: '11/2/2021, 9:00', // This isn't added until its part of the history array
    },
    {
      type: 'long',
      select: false,
      projectId: 1,
      status: 'ready',
      remainingTime: 15000000,
      duration: 15000000,
      completed: false,
      interrupted: false,
      startDate: '11/2/2021, 9:00',
      endDate: '11/2/2021, 9:00', // This isn't added until its part of the history array
    }
  ],
  history: []
}