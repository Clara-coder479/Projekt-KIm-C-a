{
  "category"; "IT",
  "question"; "Welche Technologien sind clientseitig?",
  "answers"; [
    { "correct": true, "answer": "HTML" },
    { "correct": true, "answer": "CSS" },
    { "correct": true, "answer": "JavaScript" },
    { "correct": false, "answer": "PHP" }
  ],
  "explanation"; "HTML, CSS und JavaScript - Serverseitig PHP und JavaScript (mit node.js)"
}

document.addEventListener("DOMContentLoaded", function () {
  const JSONUrl = "/extensions/Selfhtml/example.php/Beispiel:Multiple-choice-questions.json";	
}

  async function loadQuestions() {
    try {
      const response = await fetch(JSONUrl);
      const data = await response.json();
      questions = data.data;
    } catch (error) {
      console.error("Fehler beim Laden der Fragen:", error);
    }
  }

  function renderQuestion(index) {
  const questionData = questions[index];
  const oldFieldset = form.querySelector("fieldset");
  if (oldFieldset) oldFieldset.remove();

  const quizContent = template.content.cloneNode(true);
  const fieldset = quizContent.querySelector("fieldset");
  const legend = fieldset.querySelector("legend");

  legend.innerHTML = `${questionData.category}: ${questionData.question}`;

  while (fieldset.children.length > 1) {
    fieldset.removeChild(fieldset.lastChild);
  }

  const shuffledAnswers = [...questionData.answers];
  shuffleArray(shuffledAnswers);

  shuffledAnswers.forEach((answer, i) => {
    const inputId = `q${index}_a${i}`;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index}`;
    input.id = inputId;
    input.value = answer.answer;

    const label = document.createElement("label");
    label.htmlFor = inputId;
    label.textContent = answer.answer;

    fieldset.appendChild(input);
    fieldset.appendChild(label);
  });

  form.insertBefore(fieldset, button);
}

function handleSubmit() { 
   const selected = form.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
   if (!selected) {
     alertBox("Bitte wählen Sie eine Antwort aus!", "error");
     return;
   }

   const question = questions[currentQuestionIndex];
   const selectedValue = selected.value;
   const selectedAnswerObj = question.answers.find(a => a.answer === selectedValue);
   const correctAnswer = question.answers.find(a => a.correct);

   const isCorrect = selectedAnswerObj?.correct;

   // Store result
   results.push({
     question: question.question,
     userAnswer: selectedValue,
     isCorrect,
     correctAnswer: correctAnswer.answer,
     explanation: question.explanation || "",
   });

   currentQuestionIndex++;

   if (currentQuestionIndex < questions.length) {
     setTimeout(() => {
       renderQuestion(currentQuestionIndex);
     }, 500);
   } else {
     form.remove(); // remove quiz form
     renderResults();
   }
  }

  function renderResults() {
   const resultList = document.createElement("ol");
   resultList.id = "result";

   results.forEach(result => {
     const li = document.createElement("li");

     const questionP = document.createElement("p");
     questionP.className = "question";
     questionP.textContent = result.question;

     const answerP = document.createElement("p");
     answerP.innerHTML = `Ihre Antwort: ${result.userAnswer}`;

     const explanationP = document.createElement("p");
     explanationP.innerHTML = `Erläuterung: ${result.explanation}`;

     li.appendChild(questionP);
     li.appendChild(answerP);
     li.appendChild(explanationP);

     resultList.appendChild(li);
   });