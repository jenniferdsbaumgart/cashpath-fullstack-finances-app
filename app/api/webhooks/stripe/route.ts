import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      // update the subscription status in your database
      const { customer, subscription, subscription_details } =
        event.data.object;

      const clerkUserId = subscription_details?.metadata?.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustormerId: customer,
          stripeSubscriptionId: subscription,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
    }

    case "customer.subscription.deleted":
      {
        // remove premium plan from user
        if (event.data.object.object !== "subscription") {
          return NextResponse.error(); // Handle cases where it's not a subscription
        }

        const subscription = await stripe.subscriptions.retrieve(
          (event.data.object as Stripe.Subscription).id,
        );

        // Narrow down the type of event.data.object
        if (event.data.object.object !== "subscription") {
          return NextResponse.error(); // Handle cases where it's not a subscription
        }

        const clerkUserId = subscription.metadata.clerk_user_id;
        if (!clerkUserId) {
          return NextResponse.error();
        }

        await clerkClient().users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeSubscriptionId: null,
            stripeCustomerId: null,
          },
          publicMetadata: {
            subscriptionPlan: null,
          },
        });
      }
      return NextResponse.json({ received: true }, { status: 200 });
  }
};
