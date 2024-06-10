export const useCountdownUpdate:
( duration: number,
  progressEl: SVGCircleElement,
  textEl: HTMLSpanElement,
  action: React.Dispatch<React.SetStateAction<number>>
) => void = (duration, progressEl, progressText, action) => {

}

const countProgressToTime:
( duration: number,
  progressEl: SVGCircleElement,
  textEl: HTMLSpanElement,
  action: React.Dispatch<React.SetStateAction<number>>
) => void
= (duration, progressEl, progressText, action) => {
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
    const progress_bar = setInterval(() => {
      progress_value++;
      progressText.innerText = `${progress_value}%`;
    void action;
    // action(duration / 10);
    if (progress_value === +data) {
      clearInterval(progress_bar);
    }
  }, duration);
};