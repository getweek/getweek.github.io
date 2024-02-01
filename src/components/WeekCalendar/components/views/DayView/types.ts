type Coords = [number, number];

export type NewEvent = {
  start: Coords;
  end: Coords;
  state: 'started' | 'ended';
};

export type NewAllDayEvent = {
  start: Date;
  end: Date;
  state: 'started' | 'ended';
};
