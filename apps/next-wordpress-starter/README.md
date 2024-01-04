This is a [NextWP](https://www.nextwp.org/) project bootstrapped with [`create-nextwp-app`](https://www.nextwp.org/packages/create-nextwp-app).

![NextWP Image](/screenshot.png)

## Getting Started

Set up your environment variables in `.env.local`:

```bash
NEXT_PUBLIC_WP_URL=
NEXT_SITE_URL=
REVALIDATE_SECRET_KEY=
WP_APPLICATION_PASSWORD=
NEXT_PREVIEW_SECRET=
```

Read more about [NextWP environment variables](https://www.nextwp.org/environment-variables).

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about NextWP, take a look at the following resources:

- [NextWP Documentation](https://www.nextwp.org/) - learn about NextWP features and API.
- [NextWP Quickstart guide](https://www.nextwp.org/quickstart) - quickstart guide for NextWP.

You can check out [the NextWP GitHub repository](https://github.com/CalebBarnes/nextwp) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your NextWP app is to use the Vercel one click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCalebBarnes%2Fnextwp-starter&env=NEXT_PUBLIC_WP_URL,WP_APPLICATION_PASSWORD,NEXT_PREVIEW_SECRET,REVALIDATE_SECRET_KEY&envDescription=These%20environment%20variables%20are%20necessary%20for%20the%20Next.js%20to%20WordPress%20connection%20via%20NextWP.%20Refer%20to%20the%20NextWP%20docs%20for%20more%20information.&envLink=https%3A%2F%2Fwww.nextwp.org%2Fenvironment-variables&demo-title=NextWP%20Starter&demo-description=A%20Next.js%20Headless%20WordPress%20site%20built%20with%20NextWP.&demo-url=https%3A%2F%2Fnextwp-starter.vercel.app&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FCalebBarnes%2Fnextwp-starter%2Fmain%2Fscreenshot.png)

or, you can create a new project with `create-nextwp-app` and deploy manually:

```bash
npx create-nextwp-app
```

Once you have created your project, you can deploy it with [Vercel](https://vercel.com/) or any other hosting provider.
