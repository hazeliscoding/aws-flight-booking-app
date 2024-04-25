export type SeatsType = {
  [key: string]: string[];
};

export const seatdata: SeatsType = {
  row1: ["1A", "1B", "1C", "1D", "1E", "1F"],
  row2: ["2A", "2B", "2C", "2D", "2E", "2F"],
  row3: ["3A", "3B", "3C", "3D", "3E", "3F"],
  row4: ["4A", "4B", "4C", "4D", "4E", "4F"],
  row5: ["5A", "5B", "5C", "5D", "5E", "5F"],
  row6: ["6A", "6B", "6C", "6D", "6E", "6F"],
  row7: ["7A", "7B", "7C", "7D", "7E", "7F"],
};

export type SeatType = {
  SeatID: string;
  IsBooked: string; // Assuming IsBooked is a string as per your data. You might want to convert it to boolean.
};

type ProcessedSeats = {
  [key: string]: SeatType[];
};

export const processSeatsData = (fetchedSeats: SeatType[]): ProcessedSeats => {
  const processedSeats: ProcessedSeats = {};
  fetchedSeats.forEach((seat) => {
    const row = seat.SeatID.slice(0, -1);
    if (!processedSeats[row]) {
      processedSeats[row] = [];
    }
    processedSeats[row].push(seat);
  });
  return processedSeats;
};
