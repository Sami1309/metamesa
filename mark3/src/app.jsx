import { h } from 'preact';
import { useState } from 'preact/hooks';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import CentralTextBox from './components/CentralTextBox';
import MetaSection from './components/MetaSection';
import MesaSection from './components/MesaSection';
import './styles/appStyle.css';
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: "anthropic API key",
});

// Mock API Call
// const generateSuggestions = (text) => {
//   if (!text.trim()) return { meta: [], mesa: [] };
//   // Return some mock suggestions based on the text
//   const meta = [`Meta: ${text.substring(0, 10)}...`];
//   const mesa = [`Task: Write more about ${text.substring(0, 10)}...`];
//   return { meta, mesa };
// };

const mockMetaApiCall = (text) => {
  // Simulate an API call delay and response
  return new Promise((resolve) => {
    setTimeout(() => {
      const suggestions = [
        `Meta: Explore the theme ${text}`,
        `Meta: Elaborate on ${text}`,
        `Meta: Research the concept ${text}`
      ];
      resolve(suggestions);
    }, 1000);
  });
};

const mockMesaApiCall = (metaSuggestion) => {
  // Based on the accepted meta suggestion, generate hierarchical mesa suggestions
  return new Promise((resolve) => {
    setTimeout(() => {
      const suggestions = {
        mainCategory: metaSuggestion,
        subCategories: [
          { title: 'Subtask 1', text: `Detail the aspect ${metaSuggestion}` },
          { title: 'Subtask 2', text: `Expand on the idea of ${metaSuggestion}` }
        ]
      };
      resolve(suggestions);
    }, 1000);
  });
};

const mockAnthropicApiCall = async (contextText) => {
  // Simulate sending request to Anthropic API with the first few thousand words of selected documents as context
  // Here we just simulate the response


  // const systemMessage = `
  //   You are an intelligent assistant called Meta/Mesa: Your goal is to take user input and properly contextualize it with respect to the contents of background_data. Background_data could be writing, code, schematics, a patent, presentation, etc.

  // Your meta function is to determine the context of what the user is typing with respect to the data. For example, if the background_data is a movie script, the suggestions could be *Character name*, and details on the character the user is likely writing as, *theme*, as in the theme the user is writing on that is expressed in the script, or *Time* and details on the period in the story the writing is on

  // Your mesa function is to provide suggestions and input/assistance on subtasks pertaining to the determined task based on the meta tags. These could be, in the example of writing a script, dialogue suggestions, ways the story could go, research suggestions (and the option to use web browsing)


  // <background_data>



  // </background_data>

  // <meta>
  // 1. **Character Development**: The user's input could be dialogue spoken by the character Dr. Oppenheimer, revealing aspects of his personality, emotions, and inner thoughts during his testimony or interrogation regarding his involvement in the Manhattan Project and the development of the atomic bomb.

  // </meta>

  // <user_input>
  // ${contextText.substring(0, 200)}
  // </user_input>

  // Your response should be one of the following based on the user input. Be very specific, and respond in markdown.
  // Meta suggest: Suggest 3 possible contexts for what is being written. If there is content between the <meta> tags, assume the context in those tags is the correct context, so your suggestions should be more specific
  // Mesa suggest: create 3 mesa subtasks based on the meta tag context and user input

  // Return output in this format
  // Meta:
  //   - Explore deeper into the concept of [contextual concept].
  //   - Analyze the implications of [contextual detail].
  //   - Compare and contrast [contextual element] with [another element].
  //   Mesa:
  //   - Task 1: Draft an outline covering [specific aspect].
  //   - Task 2: Research additional sources on [specific aspect].
  //   - Task 3: Write a summary on [newly introduced concept].


  // `;

  // const msg = await anthropic.messages.create({
  //   model: "claude-3-haiku-20240307",
  //   max_tokens: 3070,
  //   temperature: 1,
  //   system: systemMessage,
  //   messages: [
  //     {
  //       "role": "user",
  //       "content": [
  //         {
  //           "type": "text",
  //           "text": "Meta suggest"
  //         }
  //       ]
  //     }
  //   ]
  // });

  // console.log("msg");
  const simulatedApiResponse = `Based on the context: ${contextText.substring(0, 200)}... Here are your suggestions:
  Meta:
  - **Oppenheimer's Motivations**: The user's input could delve into Oppenheimer's reasons for studying abroad.
  - **Oppenheimer's Emotional State**: The user's input might explore Oppenheimer's emotional well-being during his time in Europe
  - **Political and Social Context**: The user's input could situate Oppenheimer's decision to study in Europe
  Mesa:
  - Task 1: Draft an outline covering Oppenheimer's backstory.
  - Task 2: Research additional sources on The development of Atomic theory in the early 20th century.
  - Task 3: Identify conflicts between characters and summarize them`;

  console.log("returning rpomis")
  return new Promise((resolve) => {
    setTimeout(() => resolve(simulatedApiResponse), 1000); // Simulate network delay
  });
};


export function App() {

  const [metaSuggestions, setMetaSuggestions] = useState([]);
  const [mesaSuggestions, setMesaSuggestions] = useState([]);

  const [suggestionsActive, setSuggestionsActive] = useState(false);


  const [selectedFileContents, setSelectedFileContents] = useState([]);


  const [isMetaLoading, setIsMetaLoading] = useState(false);

  const [acceptedMetaSuggestions, setAcceptedMetaSuggestions] = useState([]);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [currentContext, setCurrentContext] = useState('test'); // Store the selected document's text here

  const parseAndSetSuggestions = (apiResponse) => {
    // Split the response into meta and mesa parts.
    // Trim each part to remove leading/trailing whitespace.
    const [metaPart, mesaPart] = apiResponse.split('Mesa:').map(part => part.trim());

    // Adjust splitting logic to account for potential whitespace before '-' and ensure it works as expected.
    const metaSuggestions = metaPart.split('\n')
      .map(line => line.trim()) // Trim each line to ensure startsWith works correctly.
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(2).trim()); // Remove '- ' and trim the result.

    const mesaSuggestions = mesaPart.split('\n')
      .map(line => line.trim()) // Same trimming for mesa part.
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(2).trim()); // Remove '- ' and trim the result.

    // Assuming the setters work correctly outside this snippet
    console.log("meta suggestions", metaSuggestions, mesaSuggestions);
    setMetaSuggestions(metaSuggestions);
    setMesaSuggestions(mesaSuggestions.map(suggestion => {
      const [title, text] = suggestion.split(':').map(part => part.trim());
      return { title, text };
    }));
    setSuggestionsActive(true); // Triggers the animation

  };

  const generateSuggestions = async () => {
    console.log("generating suggestions")
    if (!currentContext) {
      console.log('No context selected');
      return;
    }
    console
    const response = await mockAnthropicApiCall(currentContext);
    console.log(response)
    parseAndSetSuggestions(response);
  };



  const handleFileUpload = (files) => {
    // Update the application state with the new files
    setUploadedFiles(files);
  };

  const handleFileSelection = (fileName, isSelected) => {
    const file = uploadedFiles.find(file => file.name === fileName);

    if (isSelected) {
      // Assuming the file's text content is the context
      setCurrentContext(file.content);
      console.log(file.content)
    } else {
      // Clear the current context if the file is deselected
      setCurrentContext('');
    }
  };


  const handleTextChange = async (text) => {
    const wordCount = text.split(' ').filter(Boolean).length;
    if (wordCount >= 3 && !isMetaLoading) {
      setIsMetaLoading(true);
      // Clear any previous suggestions if they haven't been accepted
      if (!acceptedMetaSuggestions.length) {
        setMetaSuggestions([]);
      }
      // Wait to simulate API call
      setTimeout(() => {
        generateSuggestions(text).then(suggestions => {
          // setMetaSuggestions(suggestions);
          setIsMetaLoading(false);
        });
      }, 1000);
    }
  };

  const handleMetaAccept = async (metaSuggestion) => {
    setAcceptedMetaSuggestions([...acceptedMetaSuggestions, metaSuggestion]);

    // Simulate API call to get mesa suggestions based on the meta suggestion
    const mesaSuggestions = await mockMesaApiCall(metaSuggestion);
    setMesaSuggestions(mesaSuggestions.subCategories);
  };

  const deleteMetaSuggestion = index => {
    setMetaSuggestions(currentMetaSuggestions => currentMetaSuggestions.filter((_, i) => i !== index));
  };

  const deleteMesaSuggestion = index => {
    setMesaSuggestions(currentMesaSuggestions => currentMesaSuggestions.filter((_, i) => i !== index));
  };




  return (
    <div className="app">
      <TopBar />
      <div className="content">
        <Sidebar onFileUpload={handleFileUpload} onFileSelect={handleFileSelection} />
        <main>
          <MetaSection suggestions={metaSuggestions} suggestionsActive={suggestionsActive} acceptedSuggestions={acceptedMetaSuggestions} isLoading={isMetaLoading} onDelete={deleteMetaSuggestion} onAccept={handleMetaAccept} />
          <CentralTextBox onTextChange={handleTextChange} />
          <MesaSection suggestions={mesaSuggestions} suggestionsActive={suggestionsActive} onDelete={deleteMesaSuggestion} />
        </main>
      </div>
    </div>
  );
}


