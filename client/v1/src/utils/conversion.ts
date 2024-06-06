export const convertSecondsToHms: (seconds: number) => {
  hours: number;
  minutes: number;
  seconds: number;
} = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;

  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsAfterMinutes = remainingSeconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSecondsAfterMinutes,
  };
};


export const extractDMYFromDateString: (dateString: string) => string = (
  dateString
) => {
  const dateComputed = new Date(dateString);
  const template = `${dateComputed
    .getDate()
    .toString()
    .padStart(2, "0")}/${dateComputed
    .getMonth()
    .toString()
    .padStart(2, "0")}/${dateComputed.getFullYear()}`;
  return template;
};