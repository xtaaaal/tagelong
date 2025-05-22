In this final post, we will look at how to deploy our Next.js project to Vercel.

In the last post, we covered how to deploy our backend to **Strapi Cloud** and seed it with initial data.

If you missed the previous post, you can find them in the following links.


- [Part 1: Learn Next.js by building a website](https://strapi.io/blog/epic-next-js-15-tutorial-part-1-learn-next-js-by-building-a-real-life-project)
- [Part 2: Building Out The Hero Section of the homepage](https://strapi.io/blog/epic-next-js-15-tutorial-part-2-building-out-the-home-page)
- [Part 3: Finishup up the homepage Features Section, TopNavigation and Footer](https://strapi.io/blog/epic-next-js-15-tutorial-part-3-finishup-up-the-homepage-features-section-top-navigation-and-footer)
- [Part 4: How to handle login and Authentification in Next.js](https://strapi.io/blog/epic-next-js-15-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js)
- [Part 5: Building out the Dashboard page and upload file using NextJS server actions](https://strapi.io/blog/epic-next-js-15-tutorial-part-5-file-upload-using-server-actions)
- [Part 6: Get Video Transcript with OpenAI Function](https://strapi.io/blog/epic-next-js-15-tutorial-part-6-create-video-summary-with-next-js-and-open-ai)
- [Part 7: Strapi CRUD permissions](https://strapi.io/blog/epic-next-js-15-tutorial-part-7-next-js-and-strapi-crud-permissions) 
- [Part 8: Search & pagination in Nextjs](https://strapi.io/blog/epic-next-js-15-tutorial-part-8-search-and-pagination-in-next-js)
- [Part 9: Backend deployment to Strapi Cloud](https://strapi.io/blog/epic-next-js-15-tutorial-part-9-backend-deployment-to-strapi-cloud)
- Part 10: Frontend deployment to Vercel](https://strapi.io/blog/epic-next-js-15-tutorial-part-10-frontend-deployment-to-vercel)

## Let's Create a Vercel Account.

If you don't have a **Vercel** account, let's go and create one.

Navigate to the following link [here](https://vercel.com) and click the **"Sign Up"** button to get started.

![001-vercel.png](https://api-prod.strapi.io/uploads/001_vercel_20b3e34bd3.png)

Now, complete the steps to create your account. I will choose the **hobby** plan and sign up using my **GitHub** account.

![002-create-account.gif](https://api-prod.strapi.io/uploads/002_create_account_360e0044f2.gif)

Now that we have created our **Vercel** account, let's prepare our frontend for deployment.

## Preparing Our Project For Deployment

First things first, let's navigate to our **Strapi Cloud** deployed project and get the URL where our project is hosted.

### Navigate to Strapi Cloud
You can get to your dashboard with the following [link](https://cloud.strapi.io/).

Once logged in to Strapi Cloud, navigate to your **_Project > Setting > Domains_** to see the domain in which your project is hosted.

![003-strapi-url.gif](https://api-prod.strapi.io/uploads/003_strapi_url_d40ca515d6.gif)

Go ahead and copy it.

Before deploying your project, we will test it by pointing our local frontend to our deployed backend.

So on your local computer, navigate your projects, find your `.env.local` file, and add the following variable.

```env
  STRAPI_URL=add_your_strapi_domain_here
```

> **Warning**: This is not something you should do. But I just wanted to show you a common error that you may encounter if not properly configuring your image hostname. Afterwards we will revert out project to using our local dev database.

Now, we have to make a small change to our application. Originally I set up the `NEXT_PUBLIC_STRAPI_URL` environmental variable.

Prepending `NEXT_PUBLIC_` to an environmental variable will make it available on the client side. This would be fine in our project since our Strapi URL is public.

But since we only use it on the server side, we will rename it `STRAPI_URL.`

You can learn more about Next.js environmental variables [here](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).

Navigate to the `src/lib/utils.ts` file, and let's update our `getStrapiUrl` function from this:

```js
export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
}
```

To this:

```js
export function getStrapiURL() {
  return process.env.STRAPI_URL ?? "http://localhost:1337";
}
```

Now let's run the following command to test our project locally.

```bash
yarn dev
```

```bash
➜  frontend git:(main) ✗ yarn dev
 ▲ Next.js 14.2.14
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1548ms

```

When you navigate the front end of your project, you will see the following error. This is normal since we did not set up our `hostname` for our images inside the `next.config.ts` file.

```bash
 ⨯ node_modules/next/dist/shared/lib/image-loader.js (41:26) @ defaultLoader
 ⨯ Error: Invalid src prop (https://timely-joy-94aadb93be.media.strapiapp.com/ee53b3ce_4520_45da_a243_6c83f88de744_e9d2a1dc41.png) on `next/image`, hostname "timely-joy-94aadb93be.media.strapiapp.com" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
    at Array.map (<anonymous>)
```

![004-error.png](https://api-prod.strapi.io/uploads/004_error_177f8ee4df.png)

You should see the URL in the error message.

### Fix and Configure Images
So, let's fix this.

Navigate to your `next.config.js` file and make the following changes inside the `remotePatterns` array.

```bash
  {
    protocol: "https",
    hostname: "timely-joy-94aadb93be.media.strapiapp.com",
  }
```

> **Important**: Ensure you use the Strapi media-hosted URL you saw in your error message. 

It will be your project URL appended by `.media.strapiapp.com`. I just used mine for this example. But you will need to replace it with yours. Now restart your Next.js frontend project, and everything should work.

Let's log in and create one summary as a test.

![005-test-localy.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/005_test_localy_2867b8b4a7.gif)

Excellent, it worked locally. Now, navigate to your Strapi CMS Admin on Strapi Cloud. You should see the newly created summary in your deployed Strapi project.

![006-strapi.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/006_strapi_cf0f66b405.gif)

### Building Project Locally

As a final test, I like to build my project locally and ensure we don't get any `typescript` errors or messages.

In your terminal, run the following command.

```bash
yarn build
```

You should see the following output.

```bash
├ ƒ /api/summarize                       0 B                0 B
├ ƒ /dashboard                           150 B          87.4 kB
├ ƒ /dashboard/account                   2.24 kB         105 kB
├ ƒ /dashboard/summaries                 4.46 kB         106 kB
├ ƒ /dashboard/summaries/[videoId]       3.98 kB        98.7 kB
├ ƒ /signin                              1.25 kB         106 kB
└ ƒ /signup                              1.27 kB         106 kB
+ First Load JS shared by all            87.2 kB
  ├ chunks/117-e30e64eaefb76137.js       31.6 kB
  ├ chunks/fd9d1056-cb7ae059b8c2ee28.js  53.6 kB
  └ other shared chunks (total)          1.99 kB


ƒ Middleware                             41.4 kB

ƒ  (Dynamic)  server-rendered on demand

✨  Done in 12.45s.
```

Great, no errors, we are ready for our final deployment.

So, let's first remove the following line in our `.env.local` file that pointed to our Strapi Cloud production app.

```bash
STRAPI_URL=https://timely-joy-94aadb93be.strapiapp.com
```

I just did it to show the error you would get if you did not set up your `hostname` for the images inside the `next.config.js` file.

Moving forward, your local project should only point to your local development database. And never to production.

Finally, go ahead and save your latest changes to GitHub by doing the following command.

```bash
git add .
git commit -m "final update before Vercel deployment"
git push -u origin main
```

Now that all of our updates have been pushed. Let's deploy our Next.js project to Vercel!

## Deploying Our Next.js Project To Vercel

Let's navigate back to our **Vercel** admin page. You should see the following page.

### Use Next.js Framework as Preset
Go ahead and add your GitHub and point to your project repository.

![007-set-up-git.gif](https://api-prod.strapi.io/uploads/007_set_up_git_dfd60f643d.gif)

Let's set up our project to use the Next.js as the `framework` preset and `Root Directory` to point to our project in the `frontend` folder.

![008-setup-folder.gif](https://api-prod.strapi.io/uploads/008_setup_folder_19878da6bb.gif)

### Setup Environment Variable
Finally, let's set up our environmental variable.

We will need to add the following environmental variables.

```
HOST=will_need_to_replace_after_initial_deploy
NODE_ENV=production
STRAPI_URL=your_deployed_strapi_app_url
OPENAI_API_KEY=your_open_ai_api_key
```

We need the `HOST` and `NODE_ENV` because our configuration will require them for our set and get cookies function, which is found in the `auth-actions.ts` file.

You should see the following config object.

```javascript
const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
```

Double-check your code in the `auth-actions.ts` file to ensure that the config object is passed in all of our `cookies().set()` functions.

The completed code for the `auth-actions.ts` file can be found below.

```ts
"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  registerUserService,
  loginUserService,
} from "@/data/services/auth-service";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  cookies().set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}

const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "Identifier must have at least 3 or more characters",
    })
    .max(20, {
      message: "Please enter a valid username or email address",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must have at least 6 or more characters",
    })
    .max(100, {
      message: "Password must be between 6 and 100 characters",
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Login.",
    };
  }

  cookies().set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}

export async function logoutAction() {
  cookies().set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}
```

![012-env.png](https://api-prod.strapi.io/uploads/012_env_72ac26e524.png)

After you add the following environmental variable, you can click the deploy button to deploy your project.

![010-deploying.png](https://api-prod.strapi.io/uploads/010_deploying_a41d23df1c.png)

Once the initial deployment is finished, let's copy the deployed URL and use it to set our `HOST` environmental variable, which is required for our cookies to be set properly.

![013-redeploy.gif](https://api-prod.strapi.io/uploads/013_redeploy_bf4a25c381.gif)

Once you update the environment variable and redeploy, you should be able to log in and see your secure **httpOnly** cookies being set.

![014-setting-cookies.gif](https://api-prod.strapi.io/uploads/014_setting_cookies_912ad30245.gif)

In this tutorial, we focused on the basic implementation of setting **httpOnly** cookies. Check out [this](https://www.youtube.com/watch?v=DJvM2lSPn6w) awesome in-depth video by Lee Robinson on the topic.

## Dealing With Function Invocation Timeout

When building your Next.js application, keep this in mind. Different environments come with different caveats.

In our case, our summarize function takes more than 10 seconds to summarize a video. If you are using a **hobby** plan, this will trigger the `FUNCTION_INVOCATION_TIMEOUT` error.

![015-timeout-error.gif](https://api-prod.strapi.io/uploads/015_timeout_error_0b5cd148d6.gif)

This may have many causes; you can read more about it [here](https://vercel.com/docs/errors/FUNCTION_INVOCATION_TIMEOUT). But in my case, it was because, on a **hobby** plan, you only get 10s execution time for functions.

![016-run-time.png](https://api-prod.strapi.io/uploads/016_run_time_7425b25d84.png)

I decided to go with the most straightforward solution before exploring other options.

Upgrading to the **PRO** plan gives you the ability to increase function execution time up to `300` seconds. You can find all the details [here](https://vercel.com/docs/functions/configuring-functions/duration).

After upgrading to the pro plan, I could increase the runtime limit in my app with the following change in the `src/app/api/summarize/route.ts` file.

```ts
export const maxDuration = 150;
export const dynamic = "force-dynamic";
```

The completed file looks like the following.

```ts
import { NextRequest } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { fetchTranscript } from "@/lib/youtube-transcript";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

export const maxDuration = 150;
export const dynamic = "force-dynamic";

function transformData(data: any[]) {
  let text = "";

  data.forEach((item) => {
    text += item.text + " ";
  });

  return {
    data: data,
    text: text.trim(),
  };
}

const TEMPLATE = `
INSTRUCTIONS: 
  For the this {text} complete the following steps.
  Generate the title based on the content provided
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
    modelName: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
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
  console.log("FROM OUR ROUTE HANDLER:", req.body);

  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token)
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );

  if (user.data.credits < 1)
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );

  const body = await req.json();
  const { videoId } = body;

  let transcript: Awaited<ReturnType<typeof fetchTranscript>>;

  try {
    transcript = await fetchTranscript(videoId);

    const transformedData = transformData(transcript);
    console.log("Transcript:", transformedData.text);

    let summary: Awaited<ReturnType<typeof generateSummary>>;

    summary = await generateSummary(transformedData.text, TEMPLATE);
    console.log("Summary:", summary);
    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }
}
```

Once you make the change, save your changes to `GitHub` and redeploy.

Let's try this again.

![017-demo.gif](https://api-prod.strapi.io/uploads/017_demo_c174bd79f5.gif)
This brings me to my final thoughts.

When building an application, it is essential to consider your use case and limitations and plan your project accordingly.

One thing to consider is refactoring the application to use streaming. This is one way to get past the time limit limitation, and I will challenge you to explore it.

You can start [here](https://vercel.com/docs/functions/streaming). Next.js also has an AI SDK that simplifies working with AI and LLMs. You can learn more about it [here](https://sdk.vercel.ai/docs/introduction).

## Conclusion

It may seem like the end of the blog series, but it is just the beginning. We learned how to build a complete CRUD Next.js application with authentication and file upload functionality. We explored how to utilize Strapi CMS to manage our content and users. 

You know, have a great starting point to continue building and adding new features. We also deployed our project to Strapi Cloud and Vercel. We could have taken many other approaches. For instance, we could have moved all the summarization logic into Strapi as a plugin. We could also use a queuing system to handle long-executing tasks and return them as they are done rather than waiting for them.

But with that being said, thank you so much for your time. This tutorial/video series took me a long time to make, and I hope you had fun following along. Also, if you spot any mistakes or have questions, please leave them in the comments, and I will update the blog post accordingly.

Even though this is the end of this series, as I discover new cool things around Next.js and Strapi, I will create follow-up content and updates. Also, I will move this repo to Strapi's GitHub. It will be open-source, so anyone can help us improve or use it as a starting point for a new project. I will add the link here once I am done.

### Note about this project

This project has been updated to use Next.js 15 and Strapi 5.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.

If you have a suggestion or find a mistake in the post, please open an issue on the [GitHub repository](https://github.com/PaulBratslavsky/epic-next-15-strapi-5).

You can also find the blog post content in the [Strapi Blog](https://github.com/PaulBratslavsky/epic-next-15-strapi-5/tree/main/blog/blog-posts).

Feel free to make PRs to fix any issues you find in the project, or let me know if you have any questions.

Happy coding!

- Paul

