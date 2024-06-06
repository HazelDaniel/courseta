import { useEffect, useRef, useState } from "react";
import { CountdownCircleStyled } from "./countdown-circle.styles";

const countProgressToTime: (
  duration: number,
  progressEl: SVGCircleElement,
  textEl: HTMLSpanElement,
  action: React.Dispatch<React.SetStateAction<number>>
) => void = (duration, progressEl, progressText, action) => {
  const percentage = progressEl.getAttribute("data-value")!;
  const color = progressEl.getAttribute("data-stroke")!;
  const radius = progressEl.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  const stroke = circumference - (circumference * +percentage) / 100;
  duration = duration * 10;

  progressEl.style.setProperty("--stroke-dashoffset", stroke.toString());
  progressEl.style.setProperty("--stroke-dasharray", circumference.toString());
  progressEl.style.setProperty("--stroke", color);

  progressEl.style.setProperty(
    "--animation-time",
    `${+percentage * duration}ms`
  );

  const data = progressText.getAttribute("data-value")!;
  let progress_value = 0;
  // const initialDuration = duration;
  const progress_bar = setInterval(() => {
    progress_value++;
    progressText.innerText = `${progress_value}%`;
    void action;
    action(Math.round((duration - (progress_value / 100) * duration) / 10));
    // console.log(initialDuration - duration);
    if (progress_value === +data) {
      clearInterval(progress_bar);
    }
  }, duration);
};

export const CountdownCircle: React.FC<{
  duration: number;
  setCountdownTime: React.Dispatch<React.SetStateAction<number>>;
  countdownTime: number;
}> = ({ duration, setCountdownTime, countdownTime }) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [mountCount, setMountCount] = useState(0);

  void countdownTime;

  // console.log(countdownTime);

  useEffect(() => {
    if (progressRef && textRef && mountCount === 0) {
      countProgressToTime(
        duration,
        progressRef.current as SVGCircleElement,
        textRef.current as HTMLSpanElement,
        setCountdownTime
      );
      if (mountCount > 1) return;
      setMountCount(mountCount + 1);
    }
  }, [progressRef, textRef, duration, setCountdownTime, mountCount]);

  return (
    <CountdownCircleStyled>
      <div className="skill">
        <svg>
          <circle cx="20" cy="20" r="50%"></circle>
          <circle
            className="progress"
            cx="20"
            cy="20"
            r="50%"
            data-value="100"
            data-stroke="var(--countdown-circle-stroke-here)"
            ref={progressRef}
          ></circle>
        </svg>
        <span className="data-progress" data-value="100" ref={textRef}>
          0%
        </span>
      </div>
    </CountdownCircleStyled>
  );
};
