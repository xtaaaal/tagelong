In the previous tutorial, we completed our **Dashboard** and **Account** pages. In this section, we will work on generating our video summary using Open AI and LangChain.

- [Part 1: Learn Next.js by building a website](https://strapi.io/blog/epic-next-js-15-tutorial-part-1-learn-next-js-by-building-a-real-life-project)
- [Part 2: Building Out The Hero Section of the homepage](https://strapi.io/blog/epic-next-js-15-tutorial-part-2-building-out-the-home-page)
- [Part 3: Finishup up the homepage Features Section, TopNavigation and Footer](https://strapi.io/blog/epic-next-js-15-tutorial-part-3-finishup-up-the-homepage-features-section-top-navigation-and-footer)
- [Part 4: How to handle login and Authentification in Next.js](https://strapi.io/blog/epic-next-js-15-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js)
- [Part 5: Building out the Dashboard page and upload file using NextJS server actions](https://strapi.io/blog/epic-next-js-15-tutorial-part-5-file-upload-using-server-actions)
- [Part 6: Get Video Transcript with OpenAI Function](https://strapi.io/blog/epic-next-js-15-tutorial-part-6-create-video-summary-with-next-js-and-open-ai)
- [Part 7: Strapi CRUD permissions](https://strapi.io/blog/epic-next-js-15-tutorial-part-7-next-js-and-strapi-crud-permissions) 
- [Part 8: Search & pagination in Nextjs](https://strapi.io/blog/epic-next-js-15-tutorial-part-8-search-and-pagination-in-next-js)
- [Part 9: Backend deployment to Strapi Cloud](https://strapi.io/blog/epic-next-js-15-tutorial-part-9-backend-deployment-to-strapi-cloud)
- [Part 10: Frontend deployment to Vercel](https://strapi.io/blog/epic-next-js-15-tutorial-part-10-frontend-deployment-to-vercel)

![001-summary-form.png](https://api-prod.strapi.io/uploads/001_summary_form_3caaf9e643.png)

We will kick off the tutorial by working on our `SummaryForm` component. This time around, instead of using a `server action,` we will explore how to create an api route in Next.js.

You can learn more about Next.js route handlers [here](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

But first, let's create our summary form, which we can use to submit the request.

Navigate to `src/components/forms` and create a new file called `summary-form.tsx` and paste in the following code as the starting point.

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    toast.success("Summary Created");
    setLoading(false);
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full max-w-[960px]">
      <form
        onSubmit={handleFormSubmit}
        className="flex gap-2 items-center justify-center"
      >
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          loading={loading}
        />
      </form>
    </div>
  );
}
```

The above code contains a basic form UI and a `handleFormSubmit` function, which does not include any of our logic to get the summary yet.

We also use **Sonner**, one of my favorite toast libraries. You can learn more about it [here](https://sonner.emilkowal.ski/).

But we are not using it directly; instead, we are using the **Chadcn UI** component, which you can find [here](https://ui.shadcn.com/docs/components/sonner).

```bash
npx shadcn@latest add sonner
```

Once **Sonner** is installed, implement it in our main `layout.tsx` file by adding the following import.

```tsx
import { Toaster } from "@/components/ui/sonner";
```

And adding the code below above our `TopNav`.

```tsx
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <Toaster position="bottom-center" />
  <Header data={globalData.data.header} />
  {children}
  <Footer data={globalData.data.footer} />
</body>
```

Let's add this form to our top navigation by navigating to the `src/components/custom/header.tsx` file and making the following changes.

```tsx
// import the form
import { SummaryForm } from "@/components/forms/summary-form";

// rest of the code

export async function Header({ data }: Readonly<HeaderProps>) {
  const { logoText, ctaButton } = data;
  const user = await getUserMeLoader();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
      <Logo text={logoText.text} />
      {user.ok && <SummaryForm />}
      <div className="flex items-center gap-4">
        {user.ok ? (
          <LoggedInUser userData={user.data} />
        ) : (
          <Link href={ctaButton.url}>
            <Button>{ctaButton.text}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
```

Let's restart our frontend project and see if it shows up.

![002-toast-and-form.gif](https://api-prod.strapi.io/uploads/002_toast_and_form_2bbc55bf42.gif)

Now that our basic form is working let's examine how to set up our first API Handler Route in Next.js 15.

## How To Create A Route Handler in Next.js 15

We will have the Next.js [docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) open as a reference.

Let's start by creating a new folder inside our `app` directory called `api`, a folder called `summarize`, and a file called `route.ts`. Then, paste in the following code.

```ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("FROM OUR ROUTE HANDLER:", req.body);
  try {
    return new Response(
      JSON.stringify({ data: "return from our handler", error: null }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }
}
```

Next, let's create a service to call our new route handler. Navigate to `src/data/services` and create a new file called `summary-service.ts`.

Create a new async function called `generateSummaryService` with the following code.

```ts
export async function generateSummaryService(videoId: string) {
  const url = "/api/summarize";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ videoId: videoId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to generate summary:", error);
    if (error instanceof Error) return { error: { message: error.message } };
    return { data: null, error: { message: "Unknown error" } };
  }
}
```

The following service allows us to call our newly created route handler located at `api/summarize` endpoint. It expects us to pass a `videoId` for the video we want to summarize.

Now that we have our basic route handler let's return to our `summary-form.tsx` file and see if we can request this endpoint.

Let's modify our `handleFormSubmit` with the following code to use our newly created service. Don't forget to import the `generateSummaryService` service.

```tsx
import { generateSummaryService } from "@/data/services/summary-service";
```

```tsx
async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setLoading(true);

  const formData = new FormData(event.currentTarget);
  const videoId = formData.get("videoId") as string;

  toast.success("Generating Summary");

  const summaryResponseData = await generateSummaryService(videoId);
  console.log(summaryResponseData, "Response from route handler");

  toast.success("Testing Toast");
  setLoading(false);
}
```

When you submit your form, you should see the message returned from our route handler in our console log.

![003-route-response.gif](https://api-prod.strapi.io/uploads/003_route_response_32989f38cd.gif)

Now that we know that our **Summary Form** and **Route Handler** are connected, we can work on the logic responsible for summarizing our video.

## Using Next.js Route Handler, LangChain and Open AI To Create A Summary

This section will examine how to create a video summary based on the video transcript.

We will be using a couple of services to help us accomplish this.

### Prerequisite

You must have an account with Open AI. If you don't have one, go [here](https://platform.openai.com/docs/introduction) and create one.

### Getting Transcript From YouTube

In the past, I have used the [youtube-transcript](https://www.npmjs.com/package/youtube-transcript) library; interestingly, it broke just recently. You can read through the issues [here](https://github.com/Kakulukian/youtube-transcript/issues/19#issuecomment-2041204365).

> **NOTE**: Using other libraries, especially ones not officially supported, can lead to breaking changes, so keep this in mind.

I ended up creating my own implementation based on [this](https://www.npmjs.com/package/youtubei.js) library and created it as **Strapi Plugin**. You can learn about it [here](https://strapi.io/blog/how-to-build-your-first-strapi-5-plugin).

Which I have already deployed and we will just call that endpoint in our code to get the summary.

But I suggest checking out the tutorial above to learn how to build your own plugin and add it to your Strapi backend.

Let's navigate to `src/app/api/summarize/route.ts` and implement the logic to get the transcript.

Let's make the following changes.

```ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("FROM OUR ROUTE HANDLER:", req.body);

  const body = await req.json();
  const videoId = body.videoId;
  const url = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;

  let transcriptData;

  try {
    const transcript = await fetch(url);
    transcriptData = await transcript.text();
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }

  return new Response(JSON.stringify({ transcript: transcriptData }));
}
```

Before we test our front end, let's add a check to our form to ensure we have a valid video ID or URL.

In the `summary-form.tsx` update the `handleFormSubmit` function with the following.

```tsx
async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setLoading(true);

  const formData = new FormData(event.currentTarget);
  const videoId = formData.get("videoId") as string;

  const processedVideoId = extractYouTubeID(videoId);

  if (!processedVideoId) {
    toast.error("Invalid Youtube Video ID");
    setLoading(false);
    setValue("");
    setError({
      ...INITIAL_STATE,
      message: "Invalid Youtube Video ID",
      name: "Invalid Id",
    });
    return;
  }

  toast.success("Generating Summary");

  const summaryResponseData = await generateSummaryService(processedVideoId);
  console.log(summaryResponseData, "Response from route handler");

  toast.success("Testing Toast");
  setLoading(false);
}
```

Notice that we are using the `extractYouTubeID` function to ensure we have a valid YouTube video ID.

If we don't have a valid video ID or URL, we will show an error message and stop the function from continuing.

Now before we test our front end, let's add the `extractYouTubeID` function to our `utils.ts` file.

Here is the code for the `extractYouTubeID` function.

```ts
export function extractYouTubeID(urlOrID: string): string | null {
  // Regular expression for YouTube ID format
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;

  // Check if the input is a YouTube ID
  if (regExpID.test(urlOrID)) {
    return urlOrID;
  }

  // Regular expression for standard YouTube links
  const regExpStandard = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;

  // Regular expression for YouTube Shorts links
  const regExpShorts = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

  // Check for standard YouTube link
  const matchStandard = urlOrID.match(regExpStandard);
  if (matchStandard) {
    return matchStandard[1];
  }

  // Check for YouTube Shorts link
  const matchShorts = urlOrID.match(regExpShorts);
  if (matchShorts) {
    return matchShorts[1];
  }

  // Return null if no match is found
  return null;
}
```

Just make sure to import it in our `summary-form.tsx` file.

```tsx
import { extractYouTubeID } from "@/lib/utils";
```

The complete `summary-form.tsx` file should look like the following.

```jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn, extractYouTubeID } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";

import { generateSummaryService } from "@/data/services/summary-service";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const videoId = formData.get("videoId") as string;

    const processedVideoId = extractYouTubeID(videoId);

    if (!processedVideoId) {
      toast.error("Invalid Youtube Video ID");
      setLoading(false);
      setValue("");
      setError({
        ...INITIAL_STATE,
        message: "Invalid Youtube Video ID",
        name: "Invalid Id",
      });
      return;
    }

    toast.success("Generating Summary");

    const summaryResponseData = await generateSummaryService(processedVideoId);
    console.log(summaryResponseData, "Response from route handler");

    toast.success("Testing Toast");
    setLoading(false);
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full max-w-[960px]">
      <form
        onSubmit={handleFormSubmit}
        className="flex gap-2 items-center justify-center"
      >
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          loading={loading}
        />
      </form>
    </div>
  );
}
```

Now, let's test our front end. Make sure to provide a valid YouTube video ID or URL.

![004-test-transcript.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/004_test_transcript_6d68e3bb4b.gif)

Once we submit our form, you should see the response in the console.

Excellent. Now that we have our transcript, we can use it to prepare our summary.

### Check if a user is logged in and has available credits

Now, let's navigate to our route handler at `src/app/api/summarize/route.ts` and add a check to check if a user is logged in and has available credits.

First, import the following helper methods.

```ts
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";
```

And the following lines are inside the `POST` function.

```ts
export async function POST(req: NextRequest) {
  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  if (user.data.credits < 1) {
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );
  }

  // rest of code
}
```

The final code should look like the following.

```ts
import { NextRequest } from "next/server";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

export async function POST(req: NextRequest) {
  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  if (user.data.credits < 1) {
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );
  }

  const body = await req.json();
  const videoId = body.videoId;
  const url = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;

  let transcriptData;

  try {
    const transcript = await fetch(url);
    transcriptData = await transcript.text();
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }

  return new Response(JSON.stringify({ transcript: transcriptData }));
}
```

We must add a check in our `summary-form.tsx` file to handle the errors inside our `handleFormSubmit` function.

Let's add the following code after this line.

```tsx
const summaryResponseData = await generateSummaryService(videoId);
console.log(summaryResponseData, "Response from route handler");

// add the following

if (summaryResponseData.error) {
  setValue("");
  toast.error(summaryResponseData.error);
  setError({
    ...INITIAL_STATE,
    message: summaryResponseData.error,
    name: "Summary Error",
  });
  setLoading(false);
  return;
}

// rest of the code
```

The completed code in the `handleFormSubmit` function should look like the following.

```tsx
async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setLoading(true);

  const formData = new FormData(event.currentTarget);
  const videoId = formData.get("videoId") as string;

  const processedVideoId = extractYouTubeID(videoId);

  if (!processedVideoId) {
    toast.error("Invalid Youtube Video ID");
    setLoading(false);
    setValue("");
    setError({
      ...INITIAL_STATE,
      message: "Invalid Youtube Video ID",
      name: "Invalid Id",
    });
    return;
  }

  toast.success("Generating Summary");

  const summaryResponseData = await generateSummaryService(processedVideoId);
  console.log(summaryResponseData, "Response from route handler");

  if (summaryResponseData.error) {
    setValue("");
    toast.error(summaryResponseData.error);
    setError({
      ...INITIAL_STATE,
      message: summaryResponseData.error,
      name: "Summary Error",
    });
    setLoading(false);
    return;
  }

  toast.success("Testing Toast");
  setLoading(false);
}
```

Now, let's test our form. Make sure to provide a valid YouTube video ID or URL and set credits to 0.

![006-testing-credits.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/006_testing_credits_c6fc523ec0.gif)

Excellent, it is working. Now, we are ready to implement our logic to get our summary. Let's do it.

### Generate Summary with LangChain and OpenAI in Next.js 15

Now, let's write our logic to handle the generation of our summary with OpenAi and LangChain.

If you never used LangChain before, it is a tool that helps you simplify building AI-powered apps. You can learn about it [here](https://js.langchain.com/docs/get_started/introduction).

![007-langchain.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/007_langchain_ce13be3e2e.png)

Before starting, install the following packages `@langchain/openai` and `langchain` with the following command.

```bash
yarn add @langchain/core @langchain/openai
```

Nice. Now, let's make the following changes in our route handler: Navigate to `src/app/api/summarize/route.ts` and make the following changes.

First, let's import all the required dependencies.

```ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
```

Now, let's create our `generateSummary` function.

```ts
async function generateSummary(content: string, template: string) {
  const prompt = PromptTemplate.fromTemplate(template);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: process.env.OPENAI_TEMPERATURE
      ? parseFloat(process.env.OPENAI_TEMPERATURE)
      : 0.7,
    maxTokens: process.env.OPENAI_MAX_TOKENS
      ? parseInt(process.env.OPENAI_MAX_TOKENS)
      : 4000,
  });

  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    const summary = await chain.invoke({ text: content });
    return summary;
  } catch (error) {
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(
      JSON.stringify({ error: "Failed to generate summary." })
    );
  }
}
```

Now, let's create a prompt template.

```ts
const TEMPLATE = `
INSTRUCTIONS: 
  For the this {text} complete the following steps.
  Generate the title for based on the content provided
  Summarize the following content and include 5 key topics, writing in first person using normal tone of voice.
  
  Write a youtube video description
    - Include heading and sections.  
    - Incorporate keywords and key takeaways

  Generate bulleted list of key points and benefits

  Return possible and best recommended key words
`;
```

You can change the template accordingly to suit your needs.

Let's use the `generateSummary` function inside our `POST` function. Update the code with the following.

The updated `POST` function should look like the following.

```ts
export async function POST(req: NextRequest) {
  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  if (user.data.credits < 1) {
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );
  }

  const body = await req.json();
  const videoId = body.videoId;
  const url = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;

  let transcriptData;

  try {
    const transcript = await fetch(url);
    transcriptData = await transcript.text();
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }

  let summary: Awaited<ReturnType<typeof generateSummary>>;

  try {
    summary = await generateSummary(transcriptData, TEMPLATE);
    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Error generating summary." }));
  }
}
```

In the code above, we implemented our `generateSummary` function, which will generate our summary and send it back to you via our form. We will also create a server action responsible for saving our data into our Strapi backend.

The complete code in the `route.ts` file should look like the following.

```ts
import { NextRequest } from "next/server";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const TEMPLATE = `
INSTRUCTIONS: 
  For the this {text} complete the following steps.
  Generate the title for based on the content provided
  Summarize the following content and include 5 key topics, writing in first person using normal tone of voice.
  
  Write a youtube video description
    - Include heading and sections.  
    - Incorporate keywords and key takeaways

  Generate bulleted list of key points and benefits

  Return possible and best recommended key words
`;

async function generateSummary(content: string, template: string) {
  const prompt = PromptTemplate.fromTemplate(template);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: process.env.OPENAI_TEMPERATURE
      ? parseFloat(process.env.OPENAI_TEMPERATURE)
      : 0.7,
    maxTokens: process.env.OPENAI_MAX_TOKENS
      ? parseInt(process.env.OPENAI_MAX_TOKENS)
      : 4000,
  });

  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    const summary = await chain.invoke({ text: content });
    return summary;
  } catch (error) {
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(
      JSON.stringify({ error: "Failed to generate summary." })
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  if (user.data.credits < 1) {
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );
  }

  const body = await req.json();
  const videoId = body.videoId;
  const url = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;

  let transcriptData;

  try {
    const transcript = await fetch(url);
    transcriptData = await transcript.text();
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }

  let summary: Awaited<ReturnType<typeof generateSummary>>;

  try {
    summary = await generateSummary(transcriptData, TEMPLATE);
    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Error generating summary." }));
  }
}
```

Before we test our form, let's add our Open AI API key to our `.env.local` file and add your Open AI API key.

> **WARNING**: Ensure your `.gitignore` file ignores the `.env*.local` file from your commit so you don't leak your Open AI key.

```
# local env files
.env*.local
```

```bash
OPENAI_API_KEY=ADD_YOUR_KEY_HERE
```

Let's test our form and see if we can get our summary. Make sure to add some credits to your user.

Excellent. We can see our output on the console.

```markdown
**Title:** Quickstart Guide to Launching Your Project with Strapi in Just 3 Minutes

**YouTube Video Description:**

**Heading:** Fast Track Your Development with Strapi: A 3-Minute Quickstart Guide

**Introduction:**
Join me today as we explore how to get your project up and running with Strapi in just three minutes! Strapi is an open-source headless CMS that simplifies the process of building, managing, and deploying content. Whether you're a developer, content creator, or project manager, this guide is designed to help you kickstart your project effortlessly.

**Sections:**

- **Setting Up Your Strapi Project:**
  - Learn how to create a new Strapi project using the quickstart command to leverage default configurations, including setting up an SQLite database.

Rest of summary...
```

Now that we know we are getting our summary, the last step is to save it to Strapi and deduct 1 credit.

### Saving Our Summary To Strapi

First, create a new `collection-type` in Strapi admin to save our summary.

Navigate to the content builder page and create a new collection named `Summary` with the following fields.

![008-create-summary.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/008_create_summary_14beffdc1b.png)

Let's add the following fields.

| Name     | Field     | Type       |
| -------- | --------- | ---------- |
| videoId  | Text      | Short Text |
| title    | Text      | Short Text |
| summary  | Rich Text | Markdown   |
| authorId | Text      | Short Text |

You can make a relations between the **Summary** and **User** collection types. But in this case we will only use the `authorId` field to store the `documentId` of the user who created the summary.

This way we don't need to expose the `user` api which is something we would have to do if we were to make a relations between the **Summary** and **User** collection types.

So whenever we want to find all summaries for a user, we can simply query the **Summary** collection type and filter by the `authorId` field.

Here is what the final fields will look like.

![010-summary-fields.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/010_summary_fields_ea3cd5f130.png)

Now, navigate to `Setting` and add the following permissions.

![011-set-permissions.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/011_set_permissions_afd3488bbe.png)

Now that we have our **Summary** `collection-type`, let's create a server action to save our data to Strapi.

Let's start by navigating to `srs/data/actions`, creating a new file called `summary-actions.ts`, and adding the following code.

```ts
"use server";

import { getAuthToken } from "@/data/services/get-token";
import { mutateData } from "@/data/services/mutate-data";
import { redirect } from "next/navigation";

interface Payload {
  data: {
    title?: string;
    videoId: string;
    summary: string;
  };
}

export async function createSummaryAction(payload: Payload) {
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  const data = await mutateData("POST", "/api/summaries", payload);
  redirect("/dashboard/summaries/" + data.data.documentId);
}
```

Now that we have our `createSummaryAction`, let's use it in our `handleFormSubmit,` found in our form named `summary-form.tsx`.

First, let's import our newly created action.

```tsx
import { createSummaryAction } from "@/data/actions/summary-actions";
```

Update the `handleFormSubmit` with the following code.

```tsx
async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setLoading(true);

  const formData = new FormData(event.currentTarget);
  const videoId = formData.get("videoId") as string;

  const processedVideoId = extractYouTubeID(videoId);

  if (!processedVideoId) {
    toast.error("Invalid Youtube Video ID");
    setLoading(false);
    setValue("");
    setError({
      ...INITIAL_STATE,
      message: "Invalid Youtube Video ID",
      name: "Invalid Id",
    });
    return;
  }

  toast.success("Generating Summary");

  const summaryResponseData = await generateSummaryService(processedVideoId);

  if (summaryResponseData.error) {
    setValue("");
    toast.error(summaryResponseData.error);
    setError({
      ...INITIAL_STATE,
      message: summaryResponseData.error,
      name: "Summary Error",
    });
    setLoading(false);
    return;
  }

  const payload = {
    data: {
      title: `Summary for video: ${processedVideoId}`,
      videoId: processedVideoId,
      summary: summaryResponseData.data,
    },
  };

  try {
    await createSummaryAction(payload);
    toast.success("Summary Created");
    // Reset form after successful creation
    setValue("");
    setError(INITIAL_STATE);
  } catch (error) {
    let errorMessage =
      "An unexpected error occurred while creating the summary";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    toast.error(errorMessage);
    setError({
      message: errorMessage,
      name: "Summary Error",
    });
    setLoading(false);
    return;
  }
  setLoading(false);
}
```

The above code will be responsible for saving our data into Strapi.

Let's do a quick test and see if it works. We should be redirected to our `summaries` route, which we have yet to create, so we will get our not found page. This is okay, and we will fix it soon.

![013-redirect.gif](https://api-prod.strapi.io/uploads/013_redirect_8f0aee2c89.gif)

But you should see your data in your Strapi Admin.

![013-1-response.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/013_1_response_fc4b9f6694.png)

You will notice that we are not setting our user or deducting one credit on creation. We will do this in Strapi by creating custom middleware. But first, let's finish all of our Next.js UI.

## Create Summary Page Card View

Let's navigate to our `dashboard` folder. Inside, create another folder named `summaries` with a `page.tsx` file and paste it into the following code.

```tsx
import Link from "next/link";
import { getSummaries } from "@/data/loaders";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LinkCardProps {
  documentId: string;
  title: string;
  summary: string;
}

function LinkCard({ documentId, title, summary }: Readonly<LinkCardProps>) {
  return (
    <Link href={`/dashboard/summaries/${documentId}`}>
      <Card className="relative">
        <CardHeader>
          <CardTitle className="leading-8 text-pink-500">
            {title || "Video Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="w-full mb-4 leading-7">
            {summary.slice(0, 164) + " [read more]"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function SummariesRoute() {
  const { data } = await getSummaries();
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item: LinkCardProps) => (
          <LinkCard key={item.documentId} {...item} />
        ))}
      </div>
    </div>
  );
}
```

Before this component works, we must create the `getSummaries` function to load our data.

Let's navigate to our `loaders.ts` file and make the following changes.

First, import the following method to give us access to our auth token for authorized requests.

```ts
import { getAuthToken } from "./services/get-token";
```

Next, update the `fetchData` function with the following code.

```ts
async function fetchData(url: string) {
  const authToken = await getAuthToken();

  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
```

Now, let's add this code at the end of the file to get our summaries.

```ts
export async function getSummaries() {
  const url = new URL("/api/summaries", baseUrl);
  return await fetchData(url.href);
}
```

Now, we need to update the following permissions in the Strapi dashboard.

![014-permissions.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/014_permissions_9b26108b1d.gif)

Under `Settings` => `User Permissions` => `Roles` => `Authenticated`, set the **Global** and **Home-page** checkboxes to `checked`.

Restart your application, and you should now be able to view the list.

![014-1-list.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/014_1_list_433167eef1.png)

Before we create the **Single Card** view, let's create a component that will display our markdown in a readable format.

We will use a package called `react-markdown` to display our markdown. You can find it [here](https://www.npmjs.com/package/react-markdown).

And install it with the following command.

```bash
 yarn add react-markdown
```

After installing `react-markdown`, let's update our `summaries/page.tsx` file to use it.

We will make the following change here.

```tsx
<CardContent>
  <p className="w-full mb-4 leading-7">
    {summary.slice(0, 164) + " [read more]"}
  </p>
</CardContent>
```

And update to the following.

```tsx
<CardContent>
  <ReactMarkdown
    className="card-markdown prose prose-sm max-w-none
              prose-headings:text-gray-900 prose-headings:font-semibold
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-4
              prose-ol:list-decimal prose-ol:pl-4"
  >
    {summary.slice(0, 164) + " [read more]"}
  </ReactMarkdown>
</CardContent>
```

We are styling it with Tailwind in line. For this to work,you will need to install the `@tailwindcss/typography` package.

```bash
yarn add @tailwindcss/typography
```

And update your `tailwind.config.ts` in the plugins array with the following code.

```ts
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
```

It should now look a bit nicer, feel free to style it more. I will show you another example of this soon.

But first, let's create the **Single Card** view.

First, we will create a dynamic route; you can learn more about dynamic routes in Next.Js docs [here](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes).

"Dynamic Routes are pages that allow you to add custom params to your URLs."

Create a new folder called `[videoId]` inside the `summaries` folder.

Inside our newly created dynamic route, create a file named `layout.tsx` with the following code.

```tsx
import { extractYouTubeID } from "@/lib/utils";

export default async function SummarySingleRoute({
  params,
  children,
}: {
  readonly params: any;
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3">{children}</div>
        <div className="col-span-2">
          <div>
            <p>Video will go here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Create another file called `page.tsx` file with the following.

```tsx
interface ParamsProps {
  params: {
    videoId: string;
  };
}

export default async function SummaryCardRoute({
  params,
}: Readonly<ParamsProps>) {
  return <p>Summary card with go here: {params.videoId}</p>;
}
```

The above code will give us a warning in Next 15.

```bash
Error: Route "/dashboard/summaries/[videoId]" used `params.videoId`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
```

[You can read more about it here](https://nextjs.org/docs/messages/sync-dynamic-apis#why-this-warning-occurred)

Let's run the following command to fix it. Just make sure you save or stash all your changes.

```bash
npx @next/codemod@canary next-async-request-api
```

```bash
➜  frontend git:(main) npx @next/codemod@canary next-async-request-api
✔ On which files or directory should the codemods be applied? … .
Executing command: jscodeshift --no-babel --ignore-pattern=**/node_modules/** --ignore-pattern=**/.next/** --extensions=tsx,ts,jsx,js --transform /Users/paulbratslavsky/.npm/_npx/6a090669e21b4303/node_modules/@next/codemod/transforms/next-async-request-api.js .
Processing 53 files...
Spawning 7 workers...
Sending 8 files to free worker...
Sending 8 files to free worker...
Sending 8 files to free worker...
Sending 8 files to free worker...
Sending 8 files to free worker...
Sending 8 files to free worker...
Sending 5 files to free worker...
All done.
Results:
0 errors
52 unmodified
0 skipped
1 ok
Time elapsed: 0.479seconds
```

and refactor the code to the following.

```tsx
export default async function SummaryCardRoute(props: Readonly<ParamsProps>) {
  const params = await props?.params;
  const { videoId } = params;
  return <p>Summary card with go here: {videoId}</p>;
}
```

Now the warning should be gone. Let's continue.

Now when you click on the summary card, you should be navigated to the single summary view and see our placeholder text.

![015-single-view.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/015_single_view_a1fba8ba81.gif)

Now that we know our pages work, let's create the loaders to get the appropriate data.

### Fetching And Displaying Our Single Video and Summary

Let's start by navigating our `loaders.ts` file and adding the following functions.

```tsx
export async function getSummaryById(summaryId: string) {
  return fetchData(`${baseUrl}/api/summaries/${summaryId}`);
}
```

Now, before using our `getSummaryById` function, let's install our video player. We will use **React Player** that you can find [here](https://www.npmjs.com/package/react-player).

Let's start by installing it with the following command.

```bash
yarn add react-player
```

Let's create a wrapper component using our **React Player** inside the `components/custom` folder. Create a new folder called `client-youtube-player` and inside create two files `youtube-player.tsx` and `index.tsx` and add the following code.

`youtube-player.tsx`

```tsx
"use client";

import ReactPlayer from "react-player/youtube";

function generateYouTubeUrl(videoId: string) {
  const baseUrl = new URL("https://www.youtube.com/watch");
  baseUrl.searchParams.append("v", videoId);
  return baseUrl.href;
}

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({
  videoId,
}: Readonly<YouTubePlayerProps>) {
  if (!videoId) return null;
  const videoUrl = generateYouTubeUrl(videoId);

  return (
    <div className="relative aspect-video rounded-md overflow-hidden">
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        className="absolute top-0 left-0"
      />
    </div>
  );
}
```

`index.tsx`

```tsx
"use client";

import dynamic from "next/dynamic";

const YouTubePlayer = dynamic(
  () => import("@/components/custom/client-youtube-player/youtube-player"),
  { ssr: false }
);

export default function ClientYouTubePlayer({ videoId }: { videoId: string }) {
  return <YouTubePlayer videoId={videoId} />;
}
```

In the code above, we use `dynamic` to disable SSR, which helps avoid issues when using some client-side components. In this blog post, you can read more [here](https://dev.to/kawanedres/leveraging-nextjs-dynamic-imports-to-solve-hydration-problems-5086).

Next.js docs reference on solving hydration issues [here](https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components)

Now that we have our **React Player** let's update the `layout.tsx` file using the following code.

```tsx
import { extractYouTubeID } from "@/lib/utils";
import { getSummaryById } from "@/data/loaders";
import ClientYouTubePlayer from "@/components/custom/client-youtube-player";

export default async function SummarySingleRoute({
  params,
  children,
}: {
  readonly params: any;
  readonly children: React.ReactNode;
}) {
  const { videoId } = await params;
  const data = await getSummaryById(videoId);
  if (data?.error?.status === 404) return <p>No Items Found</p>;
  const videoYTId = extractYouTubeID(data.data.videoId);

  return (
    <div>
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3">{children}</div>
        <div className="col-span-2">
          <ClientYouTubePlayer videoId={videoYTId as string} />
        </div>
      </div>
    </div>
  );
}
```

![015-video.png](https://api-prod.strapi.io/uploads/015_video_f2737f55b1.png)

Now, let's display our summary.

Let's first create a new file called `summary-card-form.tsx`. We can add it to our `src/components/forms` folder and paste it into the following code.

We are using **Tabs** component to switch between the preview and markdown editor. So make sure to install it by running the following command.

```bash
npx shadcn@latest add tabs
```

```tsx
/// import { updateSummaryAction, deleteSummaryAction } from "@/data/actions/summary-actions";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SubmitButton } from "@/components/custom/submit-button";
import ReactMarkdown from "react-markdown";
// import { DeleteButton } from "@/components/custom/delete-button";

export function SummaryCardForm({
  item,
  className,
}: {
  readonly item: any;
  readonly className?: string;
}) {
  // const deleteSummaryById = deleteSummaryAction.bind(null, item.documentId);

  return (
    <Card className={cn("mb-8 relative h-auto", className)}>
      <CardHeader>
        <CardTitle>Video Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <form>
            <Input
              id="title"
              name="title"
              placeholder="Update your title"
              required
              className="mb-4"
              defaultValue={item.title}
            />
            <div className="flex-1 flex flex-col">
              <Tabs
                defaultValue="preview"
                className="flex flex-col h-full gap-2"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="markdown">Edit Markdown</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="flex-1">
                  <ReactMarkdown
                    className="
                    markdown-preview
                    relative w-full h-[600px]
                    overflow-auto scroll-smooth
                    p-4 px-3 py-2
                    text-sm
                    bg-white dark:bg-gray-800 bg-transparent
                    border border-gray-300 dark:border-gray-700
                    rounded-md
                    shadow-sm
                    mb-4
                    placeholder:text-muted-foreground
                    focus-visible:outline-none
                    focus-visible:bg-gray-50
                    focus-visible:ring-1
                    focus-visible:ring-ring
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  >
                    {item.summary}
                  </ReactMarkdown>
                </TabsContent>
                <TabsContent value="markdown" className="flex-1">
                  <Textarea
                    name="summary"
                    className="
                      markdown-preview
                      relative w-full h-[600px]
                      overflow-auto scroll-smooth
                      p-4 px-3 py-2
                      text-sm
                      bg-white dark:bg-gray-800 bg-transparent
                      border border-gray-300 dark:border-gray-700
                      rounded-md
                      shadow-sm
                      mb-4
                      placeholder:text-muted-foreground
                      focus-visible:outline-none
                      focus-visible:bg-gray-50
                      focus-visible:ring-1
                      focus-visible:ring-ring
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                    defaultValue={item.summary}
                  />
                </TabsContent>
              </Tabs>
            </div>
            <input type="hidden" name="id" value={item.documentId} />
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </form>
          <form>
            {/* <DeleteButton className="absolute right-4 top-4 bg-red-700 hover:bg-red-600" /> */}
          </form>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
```

Keep in mind that in the **ReactMarkdown** component, we are passing tailwind classes for basic styling.

We are also passing a class name `markdown-preview` to the **ReactMarkdown** component.

In order to get the styling, we will need to add the following to our `globals.css` file.

```css
/* ************************** */
/* markdown preview start */
/* ************************** */

.markdown-preview {
  @apply text-base;
  @apply overflow-auto;
}

.markdown-preview h1 {
  @apply text-3xl font-bold mt-6 mb-4;
}

.markdown-preview h2 {
  @apply text-2xl font-semibold mt-5 mb-3;
}

.markdown-preview h3 {
  @apply text-xl font-medium mt-4 mb-2;
}

.markdown-preview p {
  @apply mb-4;
}

.markdown-preview ul,
.markdown-preview ol {
  @apply ml-6 mb-4;
}

.markdown-preview ul {
  @apply list-disc;
}

.markdown-preview ol {
  @apply list-decimal;
}

.markdown-preview li {
  @apply mb-2;
}

.markdown-preview a {
  @apply text-blue-600 hover:underline;
}

.markdown-preview blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic my-4;
}

.markdown-preview code {
  @apply bg-gray-100 rounded px-1 py-0.5 font-mono text-sm;
}

.markdown-preview pre {
  @apply bg-gray-100 rounded p-4 overflow-x-auto mb-4;
}

.markdown-preview pre code {
  @apply bg-transparent p-0;
}

.markdown-preview table {
  @apply w-full border-collapse mb-4;
}

.markdown-preview th,
.markdown-preview td {
  @apply border border-gray-300 px-4 py-2;
}

.markdown-preview th {
  @apply bg-gray-100 font-semibold;
}

.markdown-preview img {
  @apply max-w-full h-auto my-4;
}

.markdown-preview hr {
  @apply my-8 border-t border-gray-300;
}

/* ************************** */
/* markdown preview end       */
/* ************************** */
```

Nice.

Also, notice that we are using a new component, **DeleteButton**. Let's create it inside our `components/custom` folder. Create a `delete-button.tsx` file and add the following code. 

```tsx
"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="flex items-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );
}

interface DeleteButtonProps {
  className?: string;
}

export function DeleteButton({ className }: Readonly<DeleteButtonProps>) {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={status.pending}
      disabled={status.pending}
      className={cn(className)}
    >
      {status.pending ? <Loader /> : <TrashIcon className="w-4 h-4" />}
    </Button>
  );
}
```

Let's update our `page.tsx` file with the following code.

```tsx
import { getSummaryById } from "@/data/loaders";
import { SummaryCardForm } from "@/components/custom/summary-card-form";

interface ParamsProps {
  params: {
    videoId: string;
  };
}

export default async function SummaryCardRoute(props: Readonly<ParamsProps>) {
  const params = await props?.params;
  const { videoId } = params;
  const data = await getSummaryById(videoId);
  return <SummaryCardForm item={data.data} />;
}
```

Nice. Everything works.

![017-generating-summary.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/017_generating_summary_969b602c54.gif)

## Using Strapi Route Middleware To Set User/Summary Relation

When creating our summary, we will set the summary/user relation on the backend, where we can confirm the logged-in user creating the content.

This will prevent anyone from the front end from passing a user ID that is not their own.

We are also not handling user credit updates; let's do that in the middleware.

**What is a route middleware**

In Strapi, a route middleware is a type of middleware that has a more limited scope compared to global middlewares.

They control the request flow and can change the request itself before moving forward.

![018-middleware.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/018_middleware_85c6da3764.png)

Now that we know our front end works. Let's revisit our route handler.
They can also be used to control access to a route and perform additional logic.

For example, they can be used instead of policies to control access to an endpoint. They could modify the context before passing it down to further core elements of the Strapi server.

You can learn more about route middlewares [here](https://docs.strapi.io/dev-docs/backend-customization/middlewares).

Let's first start by creating our route middleware.

We can use our cli command. In your `backend` folder, run the following command.

```bash
yarn strapi generate
```

Choose to generate a middleware option.

```bash
➜  backend git:(main) ✗ yarn strapi generate
yarn run v1.22.22
$ strapi generate
? Strapi Generators
  api - Generate a basic API
  controller - Generate a controller for an API
  content-type - Generate a content type for an API
  policy - Generate a policy for an API
❯ middleware - Generate a middleware for an API
  migration - Generate a migration
  service - Generate a service for an API
```

Let's call it `on-summary-create` and add it to an existing API. Which will be `summary`

```bash
? Strapi Generators middleware - Generate a middleware for an API
? Middleware name on-summary-create
? Where do you want to add this middleware?
  Add middleware to root of project
❯ Add middleware to an existing API
  Add middleware to an existing plugin
```

```bash
$ strapi generate
? Strapi Generators middleware - Generate a middleware for an API
? Middleware name on-summary-create
? Where do you want to add this middleware? Add middleware to an existing API
? Which API is this for?
  global
  home-page
❯ summary
```

Now, let's take a look in the following folder: `backend/src/api/summary/middlewares.` You should see the following file: `on-summary-create` with the following boilerplate.

```js
/**
 * `on-summary-create` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In on-summary-create middleware.");

    await next();
  };
};
```

Let's update it with the following code.

```ts
/**
 * `on-summary-create` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You are not authenticated");

    const availableCredits = user.credits;
    if (availableCredits === 0)
      return ctx.unauthorized("You do not have enough credits.");

    console.log("############ Inside middleware end #############");

    // ADD THE AUTHOR ID TO THE BODY
    const modifiedBody = {
      ...ctx.request.body,
      data: {
        ...ctx.request.body.data,
        authorId: ctx.state.user.documentId,
      },
    };

    ctx.request.body = modifiedBody;

    await next();

    // UPDATE THE USER'S CREDITS
    try {
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          credits: availableCredits - 1,
        },
      });
    } catch (error) {
      ctx.badRequest("Error Updating User Credits");
    }

    console.log("############ Inside middleware end #############");
  };
};
```

In the code above, we add the authorId to the body and deduct one credit from the user.

Before testing it out, we have to enable it inside our route.

You can learn more about Strapi's routes [here](https://docs.strapi.io/dev-docs/backend-customization/routes).

Navigate to the `backend/src/api/summary/routes/summary.js` file and update with the following.

```ts
/**
 * summary router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::summary.summary", {
  config: {
    create: {
      middlewares: ["api::summary.on-summary-create"],
    },
  },
});
```

Now, our middleware will fire when we create a new summary.

Now, restart your Strapi backend and Next.js frontend and create a new summary.

You will see that we are now setting our user data.

![020-setting-user.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/020_setting_user_c68234864b.png)

## Conclusion

In this part of our Next.js 15 tutorial series, we tackled generating video summaries using Open AI and LangChain, a highlight feature for our Next.js app.

We built a SummaryForm component to handle user submissions and explored Next.js API routes for server-side logic.

We then leveraged OpenAI to summarize video transcripts, demonstrating the practical use of AI in web development.

In the next post, we will examine our summary details page and discuss updating and deleting posts.

As well as how to add policies to ensure that our user can only modify their content.

Hope you are enjoying this series as much as I am making it.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.

If you have a suggestion or find a mistake in the post, please open an issue on the [GitHub repository](https://github.com/PaulBratslavsky/epic-next-15-strapi-5).

You can also find the blog post content in the [Strapi Blog](https://github.com/PaulBratslavsky/epic-next-15-strapi-5/tree/main/blog/blog-posts).

Feel free to make PRs to fix any issues you find in the project, or let me know if you have any questions.

Happy coding!

- Paul
