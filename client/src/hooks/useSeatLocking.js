import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context.jsx";
import { getSeatSocket } from "../utils/socketClient.js";

const DEFAULT_LOCK_DURATION_MS = 5 * 60 * 1000;
const uniqueSeatIds = (seatIds = []) => [...new Set((seatIds || []).map((seatId) => String(seatId).trim()).filter(Boolean))];
const buildSeatStateFromEvent = (event) => ({
  snapshotKey: JSON.stringify({
    eventId: String(event?.id || ""),
    selectedSeatIds: uniqueSeatIds(event?.currentUserLockedSeats),
    lockedSeatIds: uniqueSeatIds(event?.lockedSeats),
    bookedSeatIds: uniqueSeatIds(event?.bookedSeats),
  }),
  selectedSeatIds: uniqueSeatIds(event?.currentUserLockedSeats),
  lockedSeatIds: uniqueSeatIds(event?.lockedSeats),
  bookedSeatIds: uniqueSeatIds(event?.bookedSeats),
});

export const useSeatLocking = ({ event, maxSelectable = 10 }) => {
  const { authorizationToken, isLoggedIn, user } = useAuth();
  const eventSeatState = buildSeatStateFromEvent(event);
  const [seatState, setSeatState] = useState(() => eventSeatState);
  const lockDurationMsRef = useRef(DEFAULT_LOCK_DURATION_MS);
  const selectedSeatIdsRef = useRef(eventSeatState.selectedSeatIds);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const activeSeatState = seatState.snapshotKey === eventSeatState.snapshotKey ? seatState : eventSeatState;
  const { selectedSeatIds, lockedSeatIds, bookedSeatIds } = activeSeatState;

  const currentUserId = user?._id || user?.id || "";
  const selectedSeatIdSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);
  const bookedSeatIdSet = useMemo(() => new Set(bookedSeatIds), [bookedSeatIds]);
  const lockedByOtherSeatIds = useMemo(
    () => lockedSeatIds.filter((seatId) => !selectedSeatIdSet.has(seatId)),
    [lockedSeatIds, selectedSeatIdSet]
  );
  const lockedByOtherSeatIdSet = useMemo(() => new Set(lockedByOtherSeatIds), [lockedByOtherSeatIds]);

  useEffect(() => {
    selectedSeatIdsRef.current = selectedSeatIds;
  }, [selectedSeatIds]);

  const updateSeatState = useCallback((updater) => {
    setSeatState((currentState) => {
      const baseState = currentState.snapshotKey === eventSeatState.snapshotKey ? currentState : eventSeatState;
      return updater(baseState);
    });
  }, [eventSeatState]);

  useEffect(() => {
    if (!event?.id) {
      return undefined;
    }

    const socket = getSeatSocket(authorizationToken);

    const joinRoom = () => {
      socket.emit("join-event", { eventId: event.id }, (response = {}) => {
        if (!response.ok) {
          return;
        }

        if (response.lockDurationMs) {
          lockDurationMsRef.current = response.lockDurationMs;
        }

        updateSeatState((currentState) => ({
          ...currentState,
          selectedSeatIds: uniqueSeatIds(response.currentUserLockedSeats),
          lockedSeatIds: uniqueSeatIds(response.lockedSeatIds),
        }));
        setIsSocketReady(true);
      });
    };

    const handleSeatLocked = ({ eventId, seatId, userId }) => {
      if (String(eventId) !== String(event.id) || !seatId) {
        return;
      }

      updateSeatState((currentState) => ({
        ...currentState,
        lockedSeatIds: uniqueSeatIds([...currentState.lockedSeatIds, seatId]),
        selectedSeatIds:
          String(userId || "") === String(currentUserId || "")
            ? uniqueSeatIds([...currentState.selectedSeatIds, seatId])
            : currentState.selectedSeatIds,
      }));
    };

    const handleSeatReleased = ({ eventId, seatId, reason }) => {
      if (String(eventId) !== String(event.id) || !seatId) {
        return;
      }

      if (reason === "expired" && selectedSeatIdsRef.current.includes(seatId)) {
        const minutes = Math.max(1, Math.round(lockDurationMsRef.current / 60000));
        toast.info(`Seat lock expired after ${minutes} minute${minutes === 1 ? "" : "s"}. Please reselect.`);
      }

      updateSeatState((currentState) => ({
        ...currentState,
        lockedSeatIds: currentState.lockedSeatIds.filter((currentSeatId) => currentSeatId !== seatId),
        selectedSeatIds: currentState.selectedSeatIds.filter((currentSeatId) => currentSeatId !== seatId),
      }));
    };

    const handleSeatBooked = ({ eventId, seatId }) => {
      if (String(eventId) !== String(event.id) || !seatId) {
        return;
      }

      updateSeatState((currentState) => ({
        ...currentState,
        bookedSeatIds: uniqueSeatIds([...currentState.bookedSeatIds, seatId]),
        lockedSeatIds: currentState.lockedSeatIds.filter((currentSeatId) => currentSeatId !== seatId),
        selectedSeatIds: currentState.selectedSeatIds.filter((currentSeatId) => currentSeatId !== seatId),
      }));
    };

    socket.on("connect", joinRoom);
    socket.on("seat-locked", handleSeatLocked);
    socket.on("seat-released", handleSeatReleased);
    socket.on("seat-booked", handleSeatBooked);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("seat-locked", handleSeatLocked);
      socket.off("seat-released", handleSeatReleased);
      socket.off("seat-booked", handleSeatBooked);
      setIsSocketReady(false);
    };
  }, [authorizationToken, currentUserId, event?.id, updateSeatState]);

  const lockSeat = (seatId) => {
    if (!event?.id || !seatId) {
      return;
    }

    if (!isLoggedIn) {
      toast.info("Please login to lock seats before checkout");
      return;
    }

    if (selectedSeatIdSet.has(seatId)) {
      return;
    }

    if (bookedSeatIdSet.has(seatId) || lockedByOtherSeatIdSet.has(seatId)) {
      toast.error("This seat is no longer available");
      return;
    }

    if (selectedSeatIds.length >= maxSelectable) {
      toast.info(`You can select up to ${maxSelectable} tickets`);
      return;
    }

    const socket = getSeatSocket(authorizationToken);
    socket.emit("lock-seat", { eventId: event.id, seatId }, (response = {}) => {
      if (!response.ok) {
        toast.error(response.message || "Unable to lock this seat right now");
        return;
      }

      if (response.lockDurationMs) {
        lockDurationMsRef.current = response.lockDurationMs;
      }

      updateSeatState((currentState) => ({
        ...currentState,
        selectedSeatIds: uniqueSeatIds([...currentState.selectedSeatIds, seatId]),
        lockedSeatIds: uniqueSeatIds([...currentState.lockedSeatIds, seatId]),
      }));
    });
  };

  const releaseSeat = (seatId) => {
    if (!event?.id || !seatId || !selectedSeatIdSet.has(seatId)) {
      return;
    }

    const socket = getSeatSocket(authorizationToken);
    socket.emit("release-seat", { eventId: event.id, seatId }, (response = {}) => {
      if (!response.ok) {
        toast.error("Unable to release this seat right now");
        return;
      }

      updateSeatState((currentState) => ({
        ...currentState,
        selectedSeatIds: currentState.selectedSeatIds.filter((currentSeatId) => currentSeatId !== seatId),
        lockedSeatIds: currentState.lockedSeatIds.filter((currentSeatId) => currentSeatId !== seatId),
      }));
    });
  };

  const toggleSeat = (seatId) => {
    if (selectedSeatIdSet.has(seatId)) {
      releaseSeat(seatId);
      return;
    }

    lockSeat(seatId);
  };

  const clearSelection = () => {
    selectedSeatIds.forEach((seatId) => {
      releaseSeat(seatId);
    });
  };

  return {
    bookedSeatIds,
    bookedSeatIdSet,
    clearSelection,
    isSocketReady,
    lockedByOtherSeatIdSet,
    lockSeat,
    releaseSeat,
    selectedSeatIds,
    selectedSeatIdSet,
    toggleSeat,
  };
};
