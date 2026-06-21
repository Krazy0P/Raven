import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { Scraper } from "agent-twitter-client";
import cron from "node-cron";
import logger from "./logger";
import supabase from "./supabase";

const scraper = new Scraper();

interface TwitterFeedRow {
  username: string;
  channel_id: string;
  last_tweet_id: string | null;
}

export default function startTwitterFeed(
  client: Client,
) {
  cron.schedule("*/2 * * * *", async () => {
    logger.info("[Twitter Feed] Checking accounts...");

    const { data: feeds, error } = await supabase
      .from("twitter_feeds")
      .select("*");

    if (error) {
      logger.error(error.message);
      return;
    }

    for (const feed of feeds as TwitterFeedRow[]) {
      try {
        const tweets = scraper.getTweets(feed.username, 1);

        let latestTweet: any = null;

        for await (const tweet of tweets) {
          latestTweet = tweet;
          break;
        }

        if (!latestTweet) {
          logger.warn(
            `[Twitter Feed] No tweets found for ${feed.username}`,
          );
          continue;
        }

        const tweetId = latestTweet.id;

        // First run
        if (!feed.last_tweet_id) {
          await supabase
            .from("twitter_feeds")
            .update({
              last_tweet_id: tweetId,
            })
            .eq("username", feed.username);

          logger.info(
            `[Twitter Feed] Initialized ${feed.username}`,
          );

          continue;
        }

        if (tweetId === feed.last_tweet_id) {
          continue;
        }

        const channel = await client.channels.fetch(
          feed.channel_id,
        );

        if (!channel?.isTextBased()) {
          logger.warn(
            `[Twitter Feed] Invalid channel ${feed.channel_id}`,
          );
          continue;
        }

        const tweetUrl = `https://x.com/${feed.username}/status/${tweetId}`;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `@${feed.username}`,
            url: `https://x.com/${feed.username}`,
          })
          .setDescription(
            latestTweet.text || "New tweet posted",
          )
          .setURL(tweetUrl)
          .setTimestamp(
            latestTweet.timeParsed
              ? new Date(latestTweet.timeParsed)
              : new Date(),
          )
          .setFooter({
            text: "X Feed",
          });

        await (channel as TextChannel).send({
          content: tweetUrl,
          embeds: [embed],
        });

        await supabase
          .from("twitter_feeds")
          .update({
            last_tweet_id: tweetId,
          })
          .eq("username", feed.username);

        logger.info(
          `[Twitter Feed] Sent tweet from ${feed.username}`,
        );
      } catch (err) {
        logger.error(
          `[Twitter Feed] ${feed.username}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }
  });
}