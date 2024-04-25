import React from "react";

type SeatProps = {
  seatNumber: string;
  isBooked?: boolean;
  onSeatClick: (seatNumber: string) => void;
};

const Seat = ({ seatNumber, isBooked, onSeatClick }: SeatProps) => (
  <>
    <input
      type="checkbox"
      id={seatNumber}
      disabled={isBooked}
      onClick={() => onSeatClick(seatNumber)}
    />
    <label htmlFor={seatNumber}>{isBooked ? "Occupied" : seatNumber}</label>
  </>
);

export default Seat;
