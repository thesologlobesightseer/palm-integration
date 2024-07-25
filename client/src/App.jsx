import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import "./App.css";

marked.use({
  gfm: true,
});

function App() {
  const [results, setResults] = useState([]);

  const [serverData, setServerData] = useState([{}]);
  const [userPrompt, setUserPrompt] = useState("");
  const [promptResulted, setPromptResulted] = useState(false);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      inputRef.current.blur();
      handleSubmit();
    }
  }

  // const API_URL = "http://localhost:3333";
  // const API_URL = "https://chatbot-integration-api.vercel.app";

  const handleSubmit = () => {
    setLoading(true);
    setServerData("");
    setPromptResulted(false);
    if (userPrompt !== "") {
      fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "prompt": userPrompt })
      })
        .then((res) => res.json())
        .then((data) => {
          const html = DOMPurify.sanitize(marked(data));
          setServerData({ ...data, html });
          inputRef.current.focus();
          setUserPrompt("");
          setPromptResulted(true);

          setResults([
            ...results,
            {
              "prompt": userPrompt,
              "answer": html
            }
          ]);
          setLoading(false);
        });
    }
  }

  const onChange = (e) => {
    setLoading(false);
    setUserPrompt(e.target.value);
  }

  return (
    <main className="main-wrapper">
      <h1 className="logo">Gemini</h1>
      <div className="page-content">
        <div className="content">
          {
            (serverData === "") 
            ? 
              (userPrompt == "" && !promptResulted
              ? 
                "Loading..." 
              : 
                `Searching for "${userPrompt}"`) 
            : 
              (serverData.html 
                ? 
                <>
                <article className="html-render" dangerouslySetInnerHTML={{ __html: serverData.html }} /> 
                </>
                :
                null
              )
          }
        </div>
      </div>
      <div className="footer">
        <textarea onChange={onChange} onKeyDown={handleKeyDown} ref={inputRef} value={userPrompt} className="content-textarea" placeholder="Please enter prompt here" />
        <button onClick={handleSubmit} className="submit-button" disabled={loading}>Search</button>
      </div>
    </main>
  );
}

export default App;
