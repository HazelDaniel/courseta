DROP SCHEMA IF EXISTS courseta_image CASCADE;
CREATE SCHEMA courseta_image;
ALTER DATABASE courseta_image SET search_path TO courseta_image;
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA courseta_image;

CREATE TABLE IF NOT EXISTS images (
	image_id	UUID NOT NULL PRIMARY KEY,
	image_url TEXT DEFAULT '',
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
