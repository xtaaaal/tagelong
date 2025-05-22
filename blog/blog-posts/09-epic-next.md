We have completed all the basic features for our YouTube Summarize AI app, which we have been working on. These include full CRUD functionality, authentication, search, pagination, and AI video summarization. If you still need to complete your project, check out our previous posts in this Epic Next.js 14 tutorial series.

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

This post will cover how to deploy your project to **Strapi Cloud**. 

## Why Strapi Cloud

It is the easiest and hassle-free way to deploy your Strapi CMS projects.

**Get Everything You Need to Run Strapi in Production**

Here are some items you get out of the box using Strapi Headless CMS Cloud that you don't have to set up yourself. 

1. **CDN** (Content Delivery Network)—This helps deliver content to users more efficiently by caching content on servers located closer to the user.
2. **Database** - **Strapi Cloud** includes a database for storing and managing the application data.
3. **Email** - **Strapi Cloud** provides email functionality, allowing users to send emails from their applications.
4. **File Storage** - **Strapi Cloud** includes file storage capabilities, allowing users to store and manage files associated with their applications.

You also can access real-time logs, share and collaborate on your project with others, and use many other features. you can learn more about **Strapi Cloud** [here](https://strapi.io/cloud)

Currently, **Strapi Cloud** is a paid feature, but you can try it out for FREE for 14 days (no credit card required). The goal is to eventually have a free-tier. However, since we are an open-source company, Strapi Headless CMS is free for anyone to use. When we started **Strapi Cloud** last year, we targeted small organizations with our $99 offering; we now offer a developer plan at $29 per month, which includes all the features mentioned above.

There are many ways to host your Strapi CMS project, and we encourage you to use the best option available. In the future, I will create another blog post covering Strapi backend deployment to [Render](https://render.com/). The caveat is that when using your own hosting solution, you will be responsible for setting up your own database, file storage, and anything else that is required.

But today, we will take the hassle-free approach and use Strapi Cloud, which offers a FREE 14-day trial.

## Preparing Our Project For Deployment

To deploy your project, you just need a GitHub repo with your project. Since you followed this tutorial, you should be ready to go. 

Here is the repo of my project.

![03-git-hub-repo.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/03_git_hub_repo_2a4338d9b0.png)

Let's get started.

## Creating Your Strapi Account 

We will start by creating a **Strapi Cloud** Account. You will use your GitHub account to sign in. To do so, navigate to the [Strapi Cloud Login](https://cloud.strapi.io/login).

You are going to choose GitHub as your login method.

![04-strapi-cloud.png](https://api-prod.strapi.io/uploads/04_strapi_cloud_a325da3186.png)

Once you click on the link, you will see the following screen. Click the `Authorize Strapi Cloud` button.

Now that you have your account, create your first project!

## Create Your First Strapi Project

![05-auth-cloud.png](https://api-prod.strapi.io/uploads/05_auth_cloud_bb5081574b.png)

You should be greeted with the following page. Let's click the `Create Project` button.

![06-create-project.png](https://api-prod.strapi.io/uploads/06_create_project_dbeec64a3e.png)

You will be greeted with the following screen to give **Strapi Cloud** a try. Notice that you do not have to provide your credit card.

![07-free-trial.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/07_free_trial_af7bffb8d7.png)

Click the `Create my project` button to continue.

Now, import your project via GitHub. Click on the button and follow the steps.

![08-github-import.png](https://api-prod.strapi.io/uploads/08_github_import_ae43f1fc76.png)

Once you authorize GitHub, you should see the following page. If not, you may need to refresh your browser.

![09-github-repo.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_github_repo_0ec3372d7a.png)

Notice I chose my GitHub account `PaulBratslavsky` and pointed to my repository `strapi-5-next-14-project-deploy.`

Let's continue by completing the steps in the **Setup** section. 

![10-setup.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/10_setup_6e4a428530.png)

I will give my project a **Display Name**, point to my **main** branch, and select **New York** as my region.

Afterward, we will click on the `Show advanced settings` button. Since our `frontend` and `backend` are in the same repo, we need to point to our Strapi CMS project in the `/backend` folder.

![11-create-project.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/11_create_project_42edaf6f0f.png)

I will keep the default node version, and since we don't have any environment variables, I will click on the `Create project` button.

You should see the following screen.

![12-starting.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/12_starting_bdd8afb5e0.png)

As the process continues, you will be redirected to the following page, where you should see the real-time logs for your deployment process.

![13-deploying.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/13_deploying_9a0e21941b.png)

Once your project finishes deploying, you should see the following screen. You can continue your project by clicking the `Visit app` button.  

![14-complete.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/14_complete_70de5ee45e.png)

If you get the `This site can't provide a secure connection` message, you have to give it a moment to allow all the changes to propagate. 

![15-message.png](https://api-prod.strapi.io/uploads/15_message_972e6702fe.png)

Once the process is finished, you will be greeted with the **Create Admin** user screen.  

![16-login.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/16_login_d71b5fde13.png)

Go ahead and create your first user. Once you have done so, you will be greeted with the Strapi dashboard screen.

![17-dashboard.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/17_dashboard_d47e54bae6.png)

Congratulations, you have deployed your very first Strapi project. 

## How To Transfer Our Local Data To Our Cloud Instance

As a bonus, let's examine how we can transfer local Strapi data to seed our new cloud instance.

Let's start by logging into Strapi cloud, going to our deployed application, and logging in.

In your Strapi admin panel, click on the `Visit App` button. This will take you to your deployed app.

Enter your credentials to log in.

Navigate to `Settings` => `Transfer Tokens` and click the `Add new Transfer Token` button.

![20-settings.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/20_settings_5be6a57f6a.png)

Fill it the following options.

**Name**: Transfer
**Description**: Transfer Token
**Token duration**: 7 days
**Token type** Full Access

And finally, click the `Save` button.

You should now see your generated token.

![22-generated-token.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/22_generated_token_90673c1dac.png)

To transfer our data, we will use the Strapi CLI Transfer command. 

Ensure you are in your `backend` folder and run the following command to see all the helpful options.

``` bash
yarn strapi help transfer
```

You should see the following output.

``` bash
$ strapi help transfer
Usage: strapi transfer [options]

Transfer data from one source to another

Options:
  --from <sourceURL>                      URL of the remote Strapi instance to get data from
  --from-token <token>                    Transfer token for the remote Strapi source
  --to <destinationURL>                   URL of the remote Strapi instance to send data to
  --to-token <token>                      Transfer token for the remote Strapi destination
  --force                                 Automatically answer "yes" to all prompts, including
                                          potentially destructive requests, and run
                                          non-interactively.
  --exclude <comma-separated data types>  Exclude data using comma-separated types. Available types:
                                          content,files,config
  --only <command-separated data types>   Include only these types of data (plus schemas). Available
                                          types: content,files,config
  -h, --help                              display help for command
✨  Done in 2.16s.
➜  backend git:(main) 
```

We will use the `transfer --to` command to point to our Strapi cloud instance.  

In my case, it is `https://clever-dawn-ec1866942d.strapiapp.com/admin` Notice I am including the `admin` portion of the url.

To start the transfer, I will type the following in my terminal: You will need to use your URL and Token, which we just generated.

![22-generated-token.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/22_generated_token_90673c1dac.png)

``` bash
yarn strapi transfer --to https://clever-dawn-ec1866942d.strapiapp.com/admin
```

Then press enter, and it will prompt you for the token that we generated just a minute ago.

``` bash
? Please enter your transfer token for the remote Strapi destination [input is hidden]
```

Paste it in and press `enter` to continue.

You will see the following message if you don't have **Strapi Enterprise**.

``` bash
? There are differences in schema between the source and destination, and the data listed above will be lost. Are you sure you want to continue? (y/N) 
```

You will see the following message, so click `y' and `enter` to continue.

``` bash
The transfer will delete existing data from the remote Strapi! Are you sure you want to proceed? (y/N)
```

You will see the following warning regarding `Review Workflows. ' This is perfectly normal. Press` y' and enter to continue.

You should see a similar output.  

``` bash
Starting transfer...
✔ entities: 46 transfered (size: 58.2 KB) (elapsed: 985 ms) 
✔ assets: 15 transfered (size: 9.6 MB) (elapsed: 9698 ms) 
✔ links: 74 transfered (size: 15.3 KB) (elapsed: 481 ms) 
✔ configuration: 36 transfered (size: 108.9 KB) (elapsed: 414 ms) 
┌─────────────────────────────────────────┬───────┬───────────────┐
│ Type                                    │ Count │ Size          │
├─────────────────────────────────────────┼───────┼───────────────┤
│ entities                                │    46 │      58.2 KB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- api::global.global                   │     2 │ (     1.5 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- api::home-page.home-page             │     2 │ (     1.9 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- api::summary.summary                 │    12 │ (    41.8 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::i18n.locale                  │     1 │ (     253 B ) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::upload.file                  │     3 │ (     4.9 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::upload.folder                │     1 │ (     265 B ) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.permission │    21 │ (     5.8 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.role       │     2 │ (     656 B ) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.user       │     2 │ (       1 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ assets                                  │    15 │       9.6 MB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- .jpg                                 │    15 │ (     9.6 MB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ links                                   │    74 │      15.3 KB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ configuration                           │    36 │     108.9 KB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ Total                                   │   171 │       9.8 MB  │
└─────────────────────────────────────────┴───────┴───────────────┘
Transfer process has been completed successfully!
✨  Done in 22.50s.
```

Once you finish, go back into your Strapi Project, which we deployed in the cloud, hit refresh, and you should now see your data.

![23-after-transfer.gif](https://delicate-dawn-ac25646e6d.media.strapiapp.com/23_after_transfer_26d1653d5f.gif)
We will keep this open because we need our project's url and token for the next step.

Nice. We just seeded our initial data into our Cloud App.

In the next blog post, we will deploy our front end to **[Vercel](https://vercel.com/)** and connect both projects.

We are on our final stretch. See you in the next post.

### Note about this project

This project has been updated to use Next.js 15 and Strapi 5.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.

If you have a suggestion or find a mistake in the post, please open an issue on the [GitHub repository](https://github.com/PaulBratslavsky/epic-next-15-strapi-5).

You can also find the blog post content in the [Strapi Blog](https://github.com/PaulBratslavsky/epic-next-15-strapi-5/tree/main/blog/blog-posts).

Feel free to make PRs to fix any issues you find in the project, or let me know if you have any questions.

Happy coding!

- Paul
