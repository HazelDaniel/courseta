import type { QuizOptionType, QuizType } from "../types";

export const Quiz: React.FC<{
  value: QuizType;
  key_: number;
  assessmentID: number;
}> = ({ value, key_, assessmentID }) => {
  return (
    <>
      <span>
        {key_}. {value.question}
      </span>

      <div className="options-area">
        {value.options.map((opt: QuizOptionType, index) => {
          return (
            <div className="option" key={index}>
              <input
                type="radio"
                name={`${assessmentID}-${value.id}`}
                id={`${assessmentID}-${value.id}-${opt.id}`}
                value={`${assessmentID}-${value.id}-${opt.id}`}
                onChange={(e: React.FormEvent) => {
                  if ((e.currentTarget as HTMLInputElement).checked) {
                    console.log(e.currentTarget);
                  }
                }}
              />
              <label htmlFor={`${assessmentID}-${value.id}-${opt.id}`}>
                {opt.text}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};
