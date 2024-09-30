CREATE DATABASE IF NOT EXISTS servers;
CREATE DATABASE IF NOT EXISTS economy;

USE servers;

    CREATE TABLE IF NOT EXISTS template (
        id              VARCHAR(32)                 NOT NULL,
        mod_name        VARCHAR(32)                 NOT NULL,
        mod_id          VARCHAR(32)                 NOT NULL,
        convict_name    VARCHAR(32)                 NOT NULL,
        convict_id      VARCHAR(32)                 NOT NULL,
        guild_name      VARCHAR(100)                NOT NULL,
        guild_id        VARCHAR(32)                 NOT NULL,
        reason          VARCHAR(512)                NULL,
        PRIMARY KEY (id)
    );


    CREATE TABLE IF NOT EXISTS ban_logs     LIKE template;
    CREATE TABLE IF NOT EXISTS unban_logs   LIKE template;
    CREATE TABLE IF NOT EXISTS kick_logs    LIKE template;
    CREATE TABLE IF NOT EXISTS timeout_logs LIKE template;
    CREATE TABLE IF NOT EXISTS strike_logs  LIKE template;

    ALTER TABLE timeout_logs ADD 
        duration        MEDIUMINT       UNSIGNED    NOT NULL;

    DROP TABLE template;

    CREATE TABLE IF NOT EXISTS strikes (
        user_id         VARCHAR(32)                     NOT NULL,
        guild_id        VARCHAR(32)                     NOT NULL,
        strikes         INT             UNSIGNED        NOT NULL,
        PRIMARY KEY (user_id, guild_id)
    );

    CREATE TABLE IF NOT EXISTS strike_reward (
        guild_id        VARCHAR(32)                     NOT NULL,
        action          ENUM('timeout', 'kick', 'ban')  NOT NULL, 
        threshold       INT             UNSIGNED        NOT NULL,
        PRIMARY KEY (guild_id, action)
    );

    CREATE TABLE IF NOT EXISTS emoji_logs (
        guild_id        VARCHAR(32)                  NOT NULL,
        emoji_id        VARCHAR(64)                 NOT NULL
    );

    CREATE TABLE IF NOT EXISTS command_logs (
        user_id         VARCHAR(32)                 NOT NULL,
        command_name    VARCHAR(32)                 NOT NULL,
        timestamp       BIGINT          UNSIGNED    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appeals (
        id              VARCHAR(32)                 NOT NULL,
        appeal          VARCHAR(512)                NOT NULL,
        PRIMARY KEY (id)
    );

USE economy;

    CREATE TABLE IF NOT EXISTS bank (
        id              BIGINT      UNSIGNED    NOT NULL,
        pocket          BIGINT      UNSIGNED    NOT NULL    DEFAULT 0,
        bank            BIGINT      UNSIGNED    NOT NULL    DEFAULT 0,
        bank_limit      BIGINT      UNSIGNED    NOT NULL    DEFAULT 5000
    );