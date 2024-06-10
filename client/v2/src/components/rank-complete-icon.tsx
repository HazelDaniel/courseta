export const RankCompleteIcon: React.FC<{completed: boolean}> = ({completed}) => {
  if (completed)
  return (
  <svg viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.59 10.58L1.42 6.41L0 7.82L5.59 13.41L17.59 1.41L16.18 0L5.59 10.58Z"
      fill="#35AC65"
    />
  </svg>
  )

  if (!completed)
    return (
      <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 11.486L6.243 6.243L11.486 11.486M11.486 1L6.242 6.243L1 1"
          stroke="#9E0505"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
  )
}