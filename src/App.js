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

const UserInputContainer = styled.div`
  display: flex;
  margin-bottom: 100px;
`;

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [gptResp, setGptResp] = useState([""]);
  const [messageList, setMessageList] = useState([
    {
      role: "system",
      content: `You are a helpful assistant that helps me to purchase a Manulife Health and Insurance Product. You need to gather informaiton about my age, first and last name. Then, ask gather a few yes/no questions about my health to see if I have any high blood pressure, TIA. 
        """
        Make sure you ask them one at a time. Start with the following sentence. Hello, I am a licensed insurance advisor from Manulife.`,
    },
  ]);

  async function onSubmit(userInput) {
    // console.log("messageList", messageList);
    // console.log("userInput", userInput);
    try {
      try {
        // it saved the previous convo between the AI and bot
        setIsLoading(true);
        let newMessageList = messageList;
        if (userInput) {
          newMessageList = [
            ...messageList,
            {
              role: "user",
              content: userInput,
            },
          ];
        }

        setMessageList(newMessageList);
        console.log("newMessageList", newMessageList);
        let completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: newMessageList,
        });
        setGptResp([
          ...gptResp,
          userInput && "<b>User:</b> <br>" + userInput,
          "<b>ChatGPT Agent:</b> <br>" +
            completion.data.choices[0].message.content,
        ]);

        newMessageList = [
          ...messageList,
          {
            role: "assistant",
            content: completion.data.choices[0].message.content,
          },
        ];

        setMessageList(newMessageList);
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
        <Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{ width: "200px", height: "150px" }}
              src="./manulife.jpg"
            ></img>
            <h1 style={{ marginLeft: "20px" }}>ManuBot</h1>
          </div>
        </Header>
        <Header></Header>

        <WaitListContainer>
          {gptResp.map((each) => {
            console.log("each", each);
            return (
              <div
                style={{ width: "100%", marginTop: "20px" }}
                dangerouslySetInnerHTML={{
                  __html: each,
                }}
              />
            );
          })}

          {isLoading && <CircularProgress style={{ marginTop: "50px" }} />}
        </WaitListContainer>

        <UserInputContainer>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="input-with-sx"
              fullWidth
              label="user input"
              variant="standard"
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
            />
          </Box>

          <Button
            onClick={async () => {
              // first update the

              setGptResp([...gptResp, "<b>User:</b> <br>" + userInput]);

              await onSubmit(userInput);
              setIsLoading(false);
            }}
          >
            send
          </Button>
        </UserInputContainer>
      </div>
    </div>
  );
};

export default App;
