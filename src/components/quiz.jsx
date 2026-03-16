// https://www.codevertiser.com/quiz-app-using-reactjs/

import { useState } from "react";
import "./quiz.css";

const Quiz = ({ question, options, correct, explanations }) => {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  function onClickButton(option) {
    setSelected(option);
    setChecked(true);
  }

  return (
    <div>
      <h2>{question}</h2>
      {options.map((option, index) => (
       
        <button
          onClick={() => onClickButton(option)}
          // disabled={checked || selected === null}
          key={index} >
          {option}
        </button>
      ))}
      {/* {checked && (selected === correct? <p> Correct </p> : <p> Wrong </p>)} */}
      {checked && (explanations[selected].text)}


    </div>
  );
};

export default Quiz;
