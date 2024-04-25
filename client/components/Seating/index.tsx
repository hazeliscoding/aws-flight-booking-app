"use client";

import React, { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

import styled from "styled-components";
import { SeatType, processSeatsData, seatdata as seats } from "./seatdata";
import Seat from "./Seat";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import "./Seat.css";
import { handleSignOut } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { FlightSelector } from "./flightSelector";
import { fetchSeats } from "@/actions/flight.action";
import { APIURL } from "@/actions/booking.actions";
type ProcessedSeats = {
  [key: string]: SeatType[];
};

const Plane = styled.div`
  margin: 20px auto;
  max-width: 370px;
`;

const Cockpit = styled.div`
  height: 250px;
  position: relative;
  overflow: hidden;
  text-align: center;
  border-bottom: 5px solid #d8d8d8;
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 500px;
    width: 100%;
    border-radius: 50%;
    border-right: 5px solid #d8d8d8;
    border-left: 5px solid #d8d8d8;
  }
  h1 {
    width: 60%;
    margin: 100px auto 35px auto;
  }
`;

const Exit = styled.div`
  position: relative;
  height: 50px;
  &:before,
  &:after {
    content: "EXIT";
    font-size: 14px;
    line-height: 18px;
    padding: 0px 2px;
    font-family: "Arial Narrow", Arial, sans-serif;
    display: block;
    position: absolute;
    background: green;
    color: white;
    top: 50%;
    transform: translate(0, -50%);
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
`;

const Fuselage = styled.div`
  border-right: 5px solid #d8d8d8;
  border-left: 5px solid #d8d8d8;
`;

const Cabin = styled.div`
  width: 370px;
`;

interface SeatSelectionProps {
  flights: {
    Origin: string;
    Destination: string;
    FlightID: string;
    DepartureTime: string;
    ArrivalTime: string;
  }[];
}

// React Component
const SeatSelection = (props: SeatSelectionProps) => {
  // You can manage state and logic here

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [flightId, setFlightId] = React.useState("");
  const [seats, setSeats] = useState<ProcessedSeats>({});
  const [isSubmiting, setIsSubmiting] = React.useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleSeatClick = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }

    if (selectedSeats.length >= 2) {
      toast({
        title: "You can only select a maximum of 2 seats and Your flight",
        description: "Please deselect seats to continue.",
      });
    }
    console.log("Length of Seat Selection: ", selectedSeats.length);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const username = (await fetchAuthSession()).userSub?.toString();
    try {
      setIsSubmiting(true);
      const postData = await fetch(APIURL, {
        method: "POST",
        body: JSON.stringify({
          flightId,
          seats: selectedSeats,
          username,
        }),
        headers: {
          Authorization: `${authToken}`,
        },
      });
      const response = await postData.json();
      toast({
        title: "Success",
        description: response.message,
        duration: 2000,
      });
      setIsSubmiting(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error(error);
      toast({
        title: error.name,
        description: error.message,
      });
    } finally {
      router.push("/");
    }
  };

  const signout = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      await handleSignOut();
      router.push("/");
    } catch (error: any) {
      console.log(error);
      return toast({
        title: error.name,
        description: error.message,
      });
    }
  };

  React.useEffect(() => {
    const loadData = async () => {
      if (flightId) {
        const fetchedSeats = await fetchSeats(flightId);
        const processedSeats = processSeatsData(fetchedSeats);
        setSeats(processedSeats);
      }
    };

    loadData();
  }, [flightId]);

  const rows = Object.keys(seats).map((rowNumber) => (
    <ol className="flex flex-row flex-nowrap justify-start" key={rowNumber}>
      {seats[rowNumber].map((seat) => (
        <li className="seat" key={seat.SeatID}>
          <Seat
            seatNumber={seat.SeatID}
            isBooked={seat.IsBooked === "True"}
            onSeatClick={() => handleSeatClick(seat.SeatID)}
          />
        </li>
      ))}
    </ol>
  ));

  return (
    <div>
      <div className="flex justify-between">
        <FlightSelector
          flights={props.flights}
          getFlightId={(flightId: string) => {
            setFlightId(flightId);
          }}
        />
        <span>
          <Button onClick={signout}>SignOut</Button>
        </span>
      </div>

      <Plane>
        <Cockpit>
          <h1 className="text-2xl">Serverless Airline</h1>
        </Cockpit>
        <Exit className="exit--front" />

        <Cabin>
          <Fuselage>
            <form onSubmit={handleSubmit}>
              {rows}

              <div className="flex justify-center mt-5">
                <Button
                  className=""
                  type="submit"
                  disabled={
                    selectedSeats.length > 2 ||
                    selectedSeats.length < 1 ||
                    !flightId
                  }
                >
                  {isSubmiting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Fuselage>
        </Cabin>
        <Exit className="exit--back" />
      </Plane>
    </div>
  );
};

export default SeatSelection;
