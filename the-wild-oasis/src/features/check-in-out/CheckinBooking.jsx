import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import CheckBox from "../../ui/Checkbox";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import useGetBooking from "../bookings/useGetBooking";
import { useParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import useCheckin from "./useCheckin";
import useGetSetting from "../settings/useGetSetting";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const { bookingId } = useParams();
  const [isConfirmPaid, setIsConfirmPaid] = useState(false);
  const [isBreakFast, setIsBreakFast] = useState(false);

  const { booking, isLoading } = useGetBooking(bookingId);
  const { isLoading: isLoadingSettings, settings } = useGetSetting();
  const { checkin, isCheckingIn } = useCheckin();

  useEffect(
    () => setIsConfirmPaid(booking?.isPaid ?? false),
    [booking, setIsConfirmPaid]
  );

  if (isLoading || isLoadingSettings) return <Spinner />;

  const { id, guests, totalPrice, numGuests, hasBreakfast, numNights } =
    booking;

  const optionalBreakFastPrice =
    settings.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    if (!isConfirmPaid) return;

    if (!hasBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakFastPrice,
          totalPrice: totalPrice + optionalBreakFastPrice,
        },
      });
    } else {
      checkin({ bookingId, breakfast: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{id}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <Box>
        <CheckBox
          checked={isBreakFast}
          onChange={() => {
            setIsBreakFast((isBreakFast) => !isBreakFast);
            setIsConfirmPaid((isConfirmPaid) => !isConfirmPaid);
          }}
        >
          You want to add breakfast for {formatCurrency(optionalBreakFastPrice)}
        </CheckBox>
      </Box>

      <Box>
        <CheckBox
          disabled={(booking.isPaid && hasBreakfast) || isCheckingIn}
          checked={isConfirmPaid}
          onChange={() => setIsConfirmPaid((isConfirmPaid) => !isConfirmPaid)}
        >
          I confirm that {guests.fullName} has paid the total amount{" "}
          {!isBreakFast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakFastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakFastPrice
              )})`}
        </CheckBox>
      </Box>

      <ButtonGroup>
        <Button
          onClick={handleCheckin}
          disabled={!isConfirmPaid || isCheckingIn}
        >
          Check in booking #{id}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
