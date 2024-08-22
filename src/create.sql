CREATE DATABASE IF NOT EXISTS server_logs;
CREATE DATABASE IF NOT EXISTS economy;

USE server_logs;

CREATE TABLE IF NOT EXISTS template (
    id              BIGINT          UNSIGNED    NOT NULL,
    mod_name        VARCHAR(32)                 NOT NULL,
    mod_id          BIGINT          UNSIGNED    NOT NULL,
    convict_name    VARCHAR(32)                 NOT NULL,
    convict_id      BIGINT          UNSIGNED    NOT NULL,
    reason          VARCHAR(512)                NULL,
    guild_id        BIGINT          UNSIGNED    NOT NULL
);

CREATE TABLE IF NOT EXISTS ban_logs     LIKE template;
CREATE TABLE IF NOT EXISTS unban_logs   LIKE template;
CREATE TABLE IF NOT EXISTS kick_logs    LIKE template;
CREATE TABLE IF NOT EXISTS timeout_logs LIKE template;

ALTER TABLE timeout_logs ADD 
    duration        MEDIUMINT       UNSIGNED    NOT NULL;

DROP TABLE template;

CREATE TABLE IF NOT EXISTS emoji_logs (
    guild_id        BIGINT          UNSIGNED    NOT NULL,
    emoji_id        VARCHAR(64)                 NOT NULL
);

CREATE TABLE IF NOT EXISTS command_logs (
    user_id         BIGINT          UNSIGNED    NOT NULL,
    command_name    VARCHAR(32)                 NOT NULL,
    timestamp       BIGINT          UNSIGNED    NOT NULL
);


USE economy;

CREATE TABLE IF NOT EXISTS bank (
    id              BIGINT      UNSIGNED    NOT NULL,
    pocket          BIGINT      UNSIGNED    NOT NULL    DEFAULT 0,
    bank            BIGINT      UNSIGNED    NOT NULL    DEFAULT 0,
    bank_limit      BIGINT      UNSIGNED    NOT NULL    DEFAULT 5000
);