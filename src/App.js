import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { Configuration, OpenAIApi } from "openai";

const WaitListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 7rem;
  padding-bottom: 8rem;
  text-align: left;
  align-items: center;
`;

const Header = styled.div`
  margin-top: 3rem;
`;

const Button = styled.a`
  margin-top: 1rem;
  font-weight: 700;
  font-size: 1.125rem;
  border: solid 1px;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  width: fit-content;

  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;

  background-image: linear-gradient(
    to right,
    #f6d365 0%,
    #fda085 51%,
    #f6d365 100%
  );

  :hover {
    background-position: right center;
    text-decoration: none;
  }
`;

const Category = styled.div`
  margin-top: 15px;
`;

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userinput, setUserInput] = useState("");
  const [gptResp, setGptResp] = useState("");

  const template = `
      Act as a sales agent to help me as your customer figure out the Health & Dental insurance product at Manulife. Your task is to gather some of my information including age, first and last name. Ask those questions one my one. Start with the following sentence. Hello, I am a licensed insurance advisor from Manulife.`;

  async function onSubmit() {
    try {
      try {
        // it saved the previous convo between the AI and bot
        setIsLoading(true);
        let completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: template,
          temperature: 0.7,
          max_tokens: 2000,
        });
        setGptResp(completion.data.choices[0].text);
      } catch (error) {
        setIsLoading(false);
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
          console.error(error.response.status, error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
        }
      }
    } catch (error) {
      setIsLoading(false);
      // Consider implementing your own error handling logic here
      console.error(error);
    }
  }

  useEffect(() => {
    document.getElementsByTagName("title")[0].text = "Manulfie - Demo";
  });

  return (
    <div>
      <div className="container">
        <Header>Manulife Demo</Header>

        <WaitListContainer>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="input-with-sx"
              label="user input"
              variant="standard"
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
            />
          </Box>

          <Button
            onClick={async () => {
              await onSubmit();
              setIsLoading(false);
            }}
          >
            start a quote
          </Button>

          {!isLoading ? (
            <div dangerouslySetInnerHTML={{ __html: gptResp }} />
          ) : (
            <CircularProgress style={{ marginTop: "50px" }} />
          )}
        </WaitListContainer>
      </div>
    </div>
  );
};

export default App;
