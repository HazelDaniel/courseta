import { useCallback, useEffect, useRef, useState } from "react";
import { convertSecondsToHms } from "../utils/conversion";

export const useCountdownLogic = () => {
  const formRef = useRef(null);
  const countdownRef = useRef(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const duration = 100;
  const [countdownTime, setCountdownTime] = useState(duration);

  const calcCountdownTime = useCallback(() => {
    return convertSecondsToHms(countdownTime);
  }, [countdownTime]);

  const calcDuration = useCallback(() => {
    return convertSecondsToHms(duration);
  }, [duration]);

  useEffect(() => {
    if (formRef.current) {
      setFormData(new FormData(formRef.current));
    }
  }, [formRef]);

  return {
    formRef,
    formData,
    setFormData,
    countdownRef,
    setCountdownTime,
    calcCountdownTime,
    calcDuration,
  };
};
