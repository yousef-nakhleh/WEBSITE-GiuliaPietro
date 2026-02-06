import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { DateTime } from 'luxon';
import useMinuteAlignedTick from '../../booking/slots/hooks/useMinuteAlignedTick';
import type { SlotsGateway, TimezoneGateway } from './api/gateways';
import type { Slot } from './types';
import SlotPickerLayout from './layout/SlotPickerLayout';

type Props = {
  businessId: string;
  serviceId: string | null;
  barberId: string | null;
  initialISO?: string;
  minuteTick?: number;
  resetSelectionTick?: number;
  onChangeISO: (iso: string | null) => void;
  slotsGateway: SlotsGateway;
  timezoneGateway: TimezoneGateway;
};

const localToUTCISO = (dateStr: string, timeStr: string, timezone: string) =>
  DateTime.fromFormat(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', { zone: timezone })
    .toUTC()
    .toISO();

export default function SlotPicker({
  businessId,
  serviceId,
  barberId,
  initialISO,
  minuteTick: externalMinuteTick,
  resetSelectionTick,
  onChangeISO,
  slotsGateway,
  timezoneGateway,
}: Props) {
  const [businessTimezone, setBusinessTimezone] = useState<string>('Europe/Rome');
  const ownMinuteTick = useMinuteAlignedTick();
  const minuteTick = externalMinuteTick ?? ownMinuteTick;

  const initialBizDate: Date = (() => {
    const zone = businessTimezone || 'Europe/Rome';
    if (initialISO) {
      const dt = DateTime.fromISO(initialISO).setZone(zone);
      return new Date(dt.year, dt.month - 1, dt.day);
    }
    const now = DateTime.now().setZone(zone);
    return new Date(now.year, now.month - 1, now.day);
  })();

  const [date, setDate] = useState<Date>(initialBizDate);
  const [perfectSlots, setPerfectSlots] = useState<Slot[]>([]);
  const [otherSlots, setOtherSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    if (!businessId || !initialISO) return;
    const dt = DateTime.fromISO(initialISO).setZone(businessTimezone);
    const corrected = new Date(dt.year, dt.month - 1, dt.day);
    setDate(corrected);
  }, [businessId, businessTimezone, initialISO]);

  useEffect(() => {
    if (resetSelectionTick === undefined) return;
    setSelectedTime('');
    onChangeISO(null);
  }, [resetSelectionTick, onChangeISO]);

  useEffect(() => {
    const loadTz = async () => {
      if (!businessId) return;
      const { timezone } = await timezoneGateway.getBusinessTimezone(businessId);
      if (timezone) setBusinessTimezone(timezone);
    };
    loadTz();
  }, [businessId, timezoneGateway]);

  useEffect(() => {
    let cancelled = false;

    const loadSlots = async () => {
      if (!businessId || !barberId || !serviceId) {
        setPerfectSlots([]);
        setOtherSlots([]);
        return;
      }

      const { perfect, other, error } = await slotsGateway.fetchSlots({
        businessId,
        barberId,
        serviceId,
        date,
      });

      if (cancelled) return;

      if (error) {
        console.error('Failed to load slots via gateway:', error);
      }

      setPerfectSlots(perfect);
      setOtherSlots(other);
    };

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [barberId, businessId, businessTimezone, date, serviceId, minuteTick, resetSelectionTick, slotsGateway]);

  useEffect(() => {
    setSelectedTime('');
  }, [serviceId, barberId, date, businessTimezone]);

  useEffect(() => {
    if (!selectedTime) {
      onChangeISO(null);
      return;
    }
    const dateStr = DateTime.fromJSDate(date).setZone(businessTimezone).toFormat('yyyy-MM-dd');
    const iso = localToUTCISO(dateStr, selectedTime, businessTimezone);
    onChangeISO(iso);
  }, [selectedTime, date, businessTimezone, onChangeISO]);

  return (
    <SlotPickerLayout
      date={date}
      businessTimezone={businessTimezone}
      perfectSlots={perfectSlots}
      otherSlots={otherSlots}
      selectedTime={selectedTime}
      onDateChange={setDate}
      onSelectTime={setSelectedTime}
    />
  );
}
